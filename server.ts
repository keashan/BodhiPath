import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes - Manually import and route the serverless functions for Dev Preview
  app.all("/api/admin/wisdom-proxy", async (req, res) => {
    try {
      console.log("--- Admin Wisdom Proxy Triggered ---");
      const cronSecret = process.env.CRON_SECRET?.trim();
      console.log("Checking CRON_SECRET on server:", { exists: !!cronSecret, length: cronSecret?.length });
      
      if (!cronSecret) {
        throw new Error("CRON_SECRET environment variable is not set on the server.");
      }
      
      // Inject the secret securely in the Authorization header
      req.headers.authorization = `Bearer ${cronSecret}`;
      // Also keep as query parameter for redundancy
      req.query.key = cronSecret;
      
      console.log("Proxying request. Headers set, params injected.");
      
      const { default: handler } = await import("./api/cron/post-wisdom.ts");
      await handler(req, res);
    } catch (error: any) {
      console.error("Proxy Error:", error);
      res.status(500).json({ 
        error: error.message || "Internal Proxy Error",
        tip: "Check if CRON_SECRET is set in the environment."
      });
    }
  });

  // Logo Redirect to new branding image
  app.get("/logo.png", (req, res) => {
    res.redirect("https://i.imgur.com/R4Xn8Gb.png");
  });

  app.all("/api/cron/post-wisdom", async (req, res) => {
    try {
      // Direct call (requires auth from client)
      const { default: handler } = await import("./api/cron/post-wisdom.ts");
      await handler(req, res);
    } catch (error: any) {
      console.error("API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`--- BodhiPath Dev Server Running ---`);
    console.log(`Port: ${PORT}`);
    console.log(`API Reachable at: http://localhost:${PORT}/api/cron/post-wisdom`);
  });
}

startServer();
