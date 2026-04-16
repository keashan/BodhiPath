import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import { postToFacebook } from "./src/services/facebookService";
import { generateDailyDharma } from "./src/services/geminiService";
import firebaseConfig from "./firebase-applet-config.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = admin.firestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vercel Cron Endpoint
  app.get("/api/cron/daily-wisdom", async (req, res) => {
    // Check for Vercel Cron Secret
    const authHeader = req.headers.authorization;
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    console.log("Running Vercel Cron Job: Daily Wisdom...");
    try {
      const result = await ensureAndPostWisdom();
      res.json({ success: true, result });
    } catch (error: any) {
      console.error("Cron job failed:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Manual trigger for testing
  app.post("/api/trigger-facebook-post", async (req, res) => {
    try {
      const result = await ensureAndPostWisdom();
      res.json({ success: true, result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

async function ensureAndPostWisdom() {
  console.log("Ensuring daily wisdom is generated and posting to Facebook...");
  
  // 1. Check if wisdom already exists for today
  const docRef = db.collection("daily_wisdom").doc("current");
  let docSnap = await docRef.get();
  let wisdom = docSnap.exists ? docSnap.data() : null;

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // If missing or older than 20 hours (to be safe for daily cycle), generate new
  if (!wisdom || (now - wisdom.timestamp > (oneDay * 0.8))) {
    console.log("Wisdom missing or stale. Generating new wisdom...");
    const newWisdom = await generateDailyDharma('en'); // Default to English for FB
    wisdom = { ...newWisdom, timestamp: now };
    
    // Save to Firestore
    await docRef.set(wisdom);
    await db.collection("daily_wisdom_history").add(wisdom);
    console.log("New wisdom saved to Firestore.");
  } else {
    console.log("Using existing wisdom from Firestore.");
  }

  // 2. Post to Facebook
  const fbAccessToken = process.env.FB_PAGE_ACCESS_TOKEN;
  const fbPageId = process.env.FB_PAGE_ID;

  if (!fbAccessToken || !fbPageId) {
    console.warn("Facebook credentials missing. Skipping post.");
    return { message: "Wisdom ensured, but Facebook credentials missing", wisdom };
  }

  const message = `"${wisdom!.quote}"\n\n— ${wisdom!.source}\n\nReflection: ${wisdom!.reflection}\n\n#Buddhism #DailyWisdom #BodhiPath`;

  const result = await postToFacebook({
    message,
    accessToken: fbAccessToken,
    pageId: fbPageId
  });

  console.log("Successfully posted to Facebook:", result.id);
  return { message: "Posted to Facebook", id: result.id, wisdom };
}

startServer();
