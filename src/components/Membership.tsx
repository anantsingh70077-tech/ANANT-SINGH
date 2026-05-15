import { motion } from 'motion/react';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Zap, 
  Bot, 
  Infinity as InfinityIcon,
  ShieldCheck,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { APP_NAME } from '../lib/constants';

const PLANS = [
  {
    name: 'Free Plan',
    price: '$0',
    description: 'Perfect for exploring INDUS ecosystem.',
    features: [
      'Basic AI capabilities',
      'Text-only interactions',
      'Standard response speed',
      'Limited daily prompts'
    ],
    accent: 'white',
    buttonText: 'Current Plan',
    comingSoon: false,
    active: false
  },
  {
    name: 'Standard Plan',
    price: '$0',
    originalPrice: '$19',
    description: 'The preferred choice for AI power users.',
    features: [
      'Faster response speed',
      'Full file analysis (PDF, Image)',
      'Multi-mode AI access',
      'Voice AI integration',
      'Increased rate limits'
    ],
    accent: 'cyan',
    buttonText: 'Claim Free Access',
    comingSoon: false,
    active: true,
    highlight: 'FREE FOR 1 YEAR'
  },
  {
    name: 'Pro Plan',
    price: '$49',
    description: 'Ultimate intelligence for enterprises.',
    features: [
      'Multi-agent systems',
      'Custom AI fine-tuning',
      'Priority compute access',
      'End-to-end encryption',
      'Advanced research tools'
    ],
    accent: 'purple',
    buttonText: 'Pre-register',
    comingSoon: true,
    active: false
  }
];

export default function Membership() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 h-full overflow-y-auto overflow-x-hidden no-scrollbar">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indus-cyan/10 border border-indus-cyan/20 text-indus-cyan text-xs font-bold tracking-widest uppercase mb-6"
        >
          <Sparkles className="w-4 h-4" /> Global Launch Event
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl lg:text-7xl font-display font-bold tracking-tighter mb-6 text-glow"
        >
          Elevate Your <span className="text-indus-cyan">Intelligence</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-xl text-indus-white/60 max-w-2xl mx-auto font-light"
        >
          {APP_NAME} is providing free Standard Membership for all early users during the launch phase. Experience the future today.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-20">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={cn(
              "relative glass-card p-10 flex flex-col group transition-all duration-500",
              plan.active ? "border-indus-cyan/40 scale-105 z-10 glow-cyan" : "hover:bg-indus-white/10",
              plan.comingSoon && "opacity-80 saturate-50"
            )}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-indus-cyan text-indus-black px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_#00E5FF]">
                {plan.highlight}
              </div>
            )}
            
            {plan.comingSoon && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-indus-black/40 backdrop-blur-[2px] rounded-2xl">
                <div className="bg-indus-white text-indus-black px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl">
                  Coming Soon
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border",
                plan.accent === 'cyan' ? "bg-indus-cyan/10 border-indus-cyan/30 text-indus-cyan" : 
                plan.accent === 'purple' ? "bg-indus-purple/10 border-indus-purple/30 text-indus-purple" : 
                "bg-indus-white/5 border-indus-white/20 text-indus-white/50"
              )}>
                {plan.accent === 'cyan' ? <Crown className="w-6 h-6" /> : 
                 plan.accent === 'purple' ? <Zap className="w-6 h-6" /> : 
                 <Bot className="w-6 h-6" />}
              </div>
              <h3 className="text-3xl font-display font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-black">{plan.price}</span>
                <span className="text-indus-white/40 font-light prose-sm">/ year</span>
                {plan.originalPrice && (
                  <span className="text-indus-white/20 line-through text-2xl ml-2">{plan.originalPrice}</span>
                )}
              </div>
              <p className="mt-4 text-indus-white/60 font-light">{plan.description}</p>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indus-white/5 flex items-center justify-center">
                    <Check className={cn("w-3 h-3", plan.accent === 'cyan' ? "text-indus-cyan" : "text-indus-white/40")} />
                  </div>
                  <span className="text-sm text-indus-white/80 font-light">{feature}</span>
                </div>
              ))}
            </div>

            <button className={cn(
              "w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all",
              plan.active 
                ? "bg-indus-cyan text-indus-black hover:glow-cyan shadow-lg" 
                : "bg-indus-white/10 text-indus-white hover:bg-indus-white/20"
            )}>
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="glass-card p-8 border-indus-white/5 flex gap-6 items-center">
          <div className="w-16 h-16 rounded-full bg-indus-cyan/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-8 h-8 text-indus-cyan" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">Secure Architecture</h4>
            <p className="text-sm text-indus-white/50">Your data is encrypted twice before it ever touches our secure cloud nodes.</p>
          </div>
        </div>
        <div className="glass-card p-8 border-indus-white/5 flex gap-6 items-center">
          <div className="w-16 h-16 rounded-full bg-indus-purple/10 flex items-center justify-center flex-shrink-0">
            <InfinityIcon className="w-8 h-8 text-indus-purple" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">Infinite Scalability</h4>
            <p className="text-sm text-indus-white/50">Built on India’s fastest distributed computing network for near-zero latency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
