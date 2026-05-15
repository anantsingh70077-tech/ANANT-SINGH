import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Sparkles, 
  User, 
  Bot, 
  History,
  Share2,
  Settings,
  FolderRoot,
  FileText,
  ChevronRight,
  Zap,
  Crown,
  Brain,
  ImageIcon,
  Maximize2,
  Link as LinkIcon,
  Copy,
  Image as ImageIconAlt,
  Code,
  Globe,
  PlusCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { cn } from '../lib/utils';
import { APP_NAME, AI_MODES, AI_MODELS } from '../lib/constants';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import ArtifactsSidebar from './ArtifactsSidebar';

interface GroundingLink {
  uri: string;
  title: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  timestamp?: any;
  imageUrl?: string;
  groundingLinks?: GroundingLink[];
  artifacts?: {
    type: 'code' | 'markdown';
    title: string;
    content: string;
    language?: string;
  }[];
}

interface ChatProps {
  initialPrompt?: string;
  setInitialPrompt?: (prompt: string) => void;
}

export default function Chat({ initialPrompt, setInitialPrompt }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Welcome back to the **${APP_NAME}** Neural Core. I am ready to process your next directive at maximum fidelity.`, 
      id: '1' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMode, setSelectedMode] = useState(AI_MODES[0]);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [activeArtifact, setActiveArtifact] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && setInitialPrompt) {
      setInput(initialPrompt);
      setInitialPrompt(''); // Reset it
      // We can't call handleSend directly here because of how state updates work
      // but we can trigger a ref or similar if we want to auto-send
    }
  }, [initialPrompt]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const detectArtifacts = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const artifacts = [];
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      artifacts.push({
        type: 'code' as const,
        language: match[1] || 'text',
        title: `Code Snippet: ${match[1] || 'unnamed'}`,
        content: match[2]
      });
    }
    return artifacts;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || !auth.currentUser) return;

    const userMessageContent = input.trim();
    const userMessageId = Date.now().toString();
    
    // Check if it's an image generation request
    const isImageRequest = userMessageContent.toLowerCase().includes('generate') && 
                          (userMessageContent.toLowerCase().includes('image') || userMessageContent.toLowerCase().includes('photo'));
    
    const userMessage: Message = { 
      role: 'user', 
      content: userMessageContent, 
      id: userMessageId,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    let currentChatId = chatId;

    try {
      if (!currentChatId) {
        currentChatId = `chat_${Date.now()}`;
        setChatId(currentChatId);
        const chatRef = doc(db, 'chats', currentChatId);
        await setDoc(chatRef, {
          userId: auth.currentUser.uid,
          title: userMessageContent.slice(0, 50),
          mode: selectedMode.id,
          model: selectedModel.id,
          messages: [userMessage],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const modelToUse = isImageRequest ? 'gemini-2.5-flash-image' : selectedModel.id;
      
      const runConfig = {
        model: modelToUse,
        config: {
          systemInstruction: `You are ${APP_NAME}, the world's most advanced AI ecosystem. You are elegant, professional, and slightly futuristic. In ${selectedMode.name} mode. Use artifacts for code or long docs.`,
          tools: [{ googleSearch: {} }],
        },
      };

      let assistantContent = '';
      let imageUrlOutput = '';
      let groundingLinks: GroundingLink[] = [];
      const assistantMessageId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { role: 'assistant', content: '', id: assistantMessageId, timestamp: new Date() }]);

      if (isImageRequest) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: userMessageContent,
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrlOutput = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            assistantContent += part.text;
          }
        }
        
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { 
            ...msg, 
            content: assistantContent || "Directive synthesized. Preview your artifact below.", 
            imageUrl: imageUrlOutput 
          } : msg
        ));
      } else {
        const responseStream = await ai.models.generateContentStream({
          model: selectedModel.id,
          contents: userMessageContent,
          config: {
            ...runConfig.config,
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
          },
        });

        let thinkingContent = '';

        for await (const chunk of responseStream) {
          const chunkText = (chunk as GenerateContentResponse).text || '';
          assistantContent += chunkText;
          
          const thinkingPart = (chunk as any).thought; // Capture thinking if available
          if (thinkingPart) {
            thinkingContent += thinkingPart;
          }

          const meta = (chunk as GenerateContentResponse).candidates?.[0]?.groundingMetadata;
          if (meta?.groundingChunks) {
            groundingLinks = meta.groundingChunks
              .filter(c => c.web)
              .map(c => ({ uri: c.web!.uri, title: c.web!.title }));
          }

          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId ? { 
              ...msg, 
              content: assistantContent,
              thinking: thinkingContent,
              groundingLinks: groundingLinks.length > 0 ? groundingLinks : msg.groundingLinks
            } : msg
          ));
        }
      }

      // Final message processing for artifacts
      const detectedArtifacts = detectArtifacts(assistantContent);
      if (imageUrlOutput) {
        detectedArtifacts.push({
          type: 'image' as any,
          title: 'Synthesized Image',
          content: imageUrlOutput
        });
      }

      // Save artifacts to Firestore for workspace
      if (detectedArtifacts.length > 0) {
        for (const art of detectedArtifacts) {
          try {
            const artId = `art_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            await setDoc(doc(db, 'artifacts', artId), {
              userId: auth.currentUser.uid,
              ...art,
              chatId: currentChatId,
              createdAt: serverTimestamp()
            });
          } catch (e) {
            console.error("Artifact save error:", e);
          }
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? { 
          ...msg, 
          artifacts: detectedArtifacts.length > 0 ? detectedArtifacts : undefined 
        } : msg
      ));

      // Update Firestore
      const chatRef = doc(db, 'chats', currentChatId);
      await updateDoc(chatRef, {
        messages: arrayUnion({
          role: 'assistant',
          content: assistantContent,
          id: assistantMessageId,
          timestamp: new Date(),
          imageUrl: imageUrlOutput || null,
          groundingLinks: groundingLinks || null
        }),
        updatedAt: serverTimestamp()
      });

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "INDUS Neural link lost. Please check your encryption and retry.", 
        id: Date.now().toString() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full bg-indus-black relative overflow-hidden">
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="absolute lg:relative inset-y-0 left-0 w-80 bg-indus-navy/60 backdrop-blur-3xl border-r border-white/5 z-50 p-6 flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Neural Archives</h3>
              <button 
                onClick={() => {
                  setMessages([{ 
                    role: 'assistant', 
                    content: `New connection established. Neural Core initialized.`, 
                    id: Date.now().toString() 
                  }]);
                  setChatId(null);
                  setIsHistoryOpen(false);
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-all border border-white/5"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {[
                "Quantum Logic Synthesis",
                "Market Anomaly Report",
                "Neural Node Debugging",
                "Strategic Planning v2"
              ].map((title, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indus-cyan/30 transition-all cursor-pointer group">
                  <p className="text-xs text-white/60 group-hover:text-white truncate">{title}</p>
                  <p className="text-[9px] text-white/20 mt-1 uppercase tracking-widest font-mono">14.05.2026</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-indus-cyan/5 border border-indus-cyan/20">
              <p className="text-[9px] font-bold text-indus-cyan uppercase tracking-widest mb-1">Archival Protocol</p>
              <p className="text-[10px] text-white/40 leading-relaxed">Older synchronizations are automatically moved to cold storage after 30 cycles.</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeArtifact && (
          <ArtifactsSidebar 
            artifact={activeArtifact} 
            onClose={() => setActiveArtifact(null)} 
          />
        )}
      </AnimatePresence>

      {/* Main Chat Flow */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Cinematic Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-indus-white/10 bg-indus-navy/40 backdrop-blur-xl relative z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-indus-cyan/10 hover:bg-indus-cyan/20 transition-all border border-indus-cyan/20"
            >
              {(() => {
                const Icon = selectedModel.icon;
                return <Icon className="w-5 h-5 text-indus-cyan shadow-cyan" />;
              })()}
            </button>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white">{selectedModel.name}</h3>
              <p className="text-[10px] text-indus-white/40 uppercase tracking-[0.2em] font-mono">Neural Interface v3.5</p>
            </div>
          </div>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-6 mt-2 w-72 p-2 rounded-2xl bg-indus-navy border border-white/10 shadow-2xl z-50 backdrop-blur-3xl"
              >
                <p className="text-[9px] font-bold text-indus-white/30 uppercase tracking-[0.25em] p-3">Select Intelligence Engine</p>
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => { setSelectedModel(model); setIsMenuOpen(false); }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all group flex items-start gap-3",
                      selectedModel.id === model.id ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      selectedModel.id === model.id ? "bg-indus-cyan/20 text-indus-cyan" : "bg-white/5 text-white/40 group-hover:text-white"
                    )}>
                      {<model.icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{model.name}</h4>
                      <p className="text-[10px] text-white/40">{model.description}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 mr-4">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Quantum State Localized</span>
            </div>
            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isHistoryOpen ? "bg-indus-cyan/20 text-indus-cyan" : "text-indus-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <History className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-indus-white/40 hover:text-white transition-colors lg:hidden">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Message Stage */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12 no-scrollbar scroll-smooth">
          {messages.length <= 1 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-indus-cyan/20 blur-2xl animate-pulse" />
                <Sparkles className="w-10 h-10 text-indus-cyan relative z-10" />
              </div>
              <h2 className="text-3xl font-display font-black mb-4 tracking-tighter">OMNI-DIRECTIONAL INTEL</h2>
              <p className="text-sm max-w-sm mx-auto text-indus-slate-400 leading-relaxed font-light">Synthesizing multiple AI modalities into a single sovereign interface. Transmit your first directive.</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-6 group",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)] border transition-transform group-hover:scale-105",
                msg.role === 'user' 
                  ? "bg-indus-navy border-white/10" 
                  : "bg-gradient-to-br from-indus-blue/40 to-indus-purple/40 border-white/20 glow-white"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white/60" /> : <Bot className="w-6 h-6 text-white" />}
              </div>

              <div className={cn(
                "max-w-[85%] lg:max-w-[70%] space-y-4",
                msg.role === 'user' ? "text-right" : "text-left"
              )}>
                <div className={cn(
                  "p-6 rounded-[2rem] text-[15px] leading-relaxed shadow-xl border",
                  msg.role === 'user' 
                    ? "bg-white/5 border-white/5 text-indus-white/90 rounded-tr-sm" 
                    : "glass-card text-indus-white rounded-tl-sm border-white/10"
                )}>
                  {(msg as any).thinking && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mb-4 p-4 rounded-xl bg-white/5 border border-white/5 overflow-hidden group/thinking"
                    >
                      <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-widest text-indus-cyan">
                        <Sparkles className="w-3 h-3 animate-pulse" /> Neural Chain of Thought
                      </div>
                      <p className="text-xs text-white/40 italic line-clamp-2 group-hover/thinking:line-clamp-none transition-all">
                        {(msg as any).thinking}
                      </p>
                    </motion.div>
                  )}
                  <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:font-black">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  
                  {msg.imageUrl && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group/img relative">
                      <img src={msg.imageUrl} alt="AI Generated" className="w-full object-cover max-h-[400px]" referrerPolicy="no-referrer" />
                      <button 
                        onClick={() => setActiveArtifact({ type: 'image', title: 'Synthesized Artifact', content: msg.imageUrl })}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                      >
                        <div className="px-6 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                          <Maximize2 className="w-4 h-4" /> Expand Artifact
                        </div>
                      </button>
                    </div>
                  )}

                  {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3 flex items-center gap-2">
                        <LinkIcon className="w-3 h-3" /> Neural Citations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingLinks.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-indus-cyan hover:bg-indus-cyan/10 transition-all flex items-center gap-2"
                          >
                            {link.title} <ChevronRight className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {msg.artifacts.map((art, idx) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-2xl bg-white/5 border border-indus-cyan/20 flex items-center justify-between group/art hover:bg-white/10 transition-all cursor-pointer"
                          onClick={() => setActiveArtifact(art)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-indus-cyan/10">
                              <Code className="w-5 h-5 text-indus-cyan" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{art.title}</h4>
                              <p className="text-[9px] text-white/30 uppercase tracking-widest">Click to Expand Visualization</p>
                            </div>
                          </div>
                          <Maximize2 className="w-4 h-4 text-white/20 group-hover/art:text-indus-cyan transition-all" />
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <div className="flex gap-2 mt-6 pt-4 border-t border-white/5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className={cn(
                  "px-2 text-[9px] font-mono tracking-[0.2em] opacity-30 flex items-center gap-2",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.role === 'assistant' && <span className="text-indus-cyan">• QUANTUM PROCESSED</span>}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Neural Input System */}
        <div className="p-6 border-t border-white/5 bg-indus-navy/20 relative z-30">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
              {AI_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all flex items-center gap-2 border",
                    selectedMode.id === mode.id 
                      ? "bg-white/10 border-indus-cyan text-indus-cyan glow-cyan" 
                      : "bg-white/5 border-transparent text-indus-white/40 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <mode.icon className="w-3.5 h-3.5" />
                  {mode.name}
                </button>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-indus-cyan/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-all rounded-[3rem]" />
              <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-[2.5rem] p-3 focus-within:border-indus-cyan/30 transition-all shadow-2xl">
                <button className="p-4 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all group/btn">
                  <Paperclip className="w-6 h-6 group-hover/btn:scale-110 duration-200" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Transmit directive to Neural Core..."
                  className="flex-1 bg-transparent border-none outline-none text-[15px] py-4 px-2 resize-none max-h-48 min-h-[56px] no-scrollbar text-white placeholder-white/20"
                  rows={1}
                />
                <div className="flex items-center gap-2 pr-2">
                  <button 
                    onClick={toggleListening}
                    className={cn(
                      "p-4 rounded-full transition-all group/btn hidden sm:flex",
                      isListening ? "bg-rose-500/20 text-rose-500 animate-pulse" : "hover:bg-white/10 text-white/40 hover:text-white"
                    )}
                  >
                    <Mic className={cn("w-6 h-6 group-hover/btn:scale-110 duration-200", isListening && "scale-110")} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="w-14 h-14 bg-white text-black rounded-[1.25rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)] disabled:opacity-30 disabled:grayscale"
                  >
                    {isTyping ? (
                      <div className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 gap-6 text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
              <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> Multi-Modal ready</span>
              <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Live Retrieval active</span>
              <span className="flex items-center gap-2"><Maximize2 className="w-3 h-3" /> Artifact Rendering enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
