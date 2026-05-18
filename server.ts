import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, GenerateVideosOperation, GenerateContentResponse } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Routes
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { model, contents, systemInstruction, tools, thinkingLevel } = req.body;
      
      const config: any = {
        systemInstruction,
        tools,
      };

      if (thinkingLevel && model.includes('gemini-3')) {
        config.thinkingConfig = { thinkingLevel };
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      res.json(response);
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  app.post('/api/ai/chat-stream', async (req, res) => {
    try {
      const { model, contents, systemInstruction, tools, thinkingLevel } = req.body;
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const config: any = {
        systemInstruction,
        tools,
      };

      if (thinkingLevel && model.includes('gemini-3')) {
        config.thinkingConfig = { thinkingLevel };
      }

      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config,
      });

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('Gemini Stream Error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  });

  app.post('/api/ai/generate-video', async (req, res) => {
    try {
      const { model, prompt, config } = req.body;
      const operation = await ai.models.generateVideos({
        model,
        prompt,
        config,
      });
      res.json({ operationName: operation.name });
    } catch (error: any) {
      console.error('Gemini Video Start Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/ai/video-status', async (req, res) => {
    try {
      const { operationName } = req.body;
      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      res.json({ 
        done: updated.done, 
        uri: updated.response?.generatedVideos?.[0]?.video?.uri 
      });
    } catch (error: any) {
      console.error('Gemini Video Status Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/ai/video-download', async (req, res) => {
    try {
      const { uri } = req.query;
      if (!uri) throw new Error('Missing video URI');

      const videoRes = await fetch(uri as string, {
        headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY as string },
      });

      const contentType = videoRes.headers.get('content-type') || 'video/mp4';
      res.setHeader('Content-Type', contentType);

      if (!videoRes.body) throw new Error('No video body');
      
      const reader = videoRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (error: any) {
      console.error('Gemini Video Download Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
