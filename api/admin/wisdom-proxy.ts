import { processWisdom } from '../_shared/handler.ts';

export default async function handler(req: any, res: any) {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    
    if (!cronSecret) {
      return res.status(500).json({ 
        error: "CRON_SECRET environment variable is not set on the server.",
        tip: "Add CRON_SECRET to your Vercel Project Settings -> Environment Variables"
      });
    }
    
    // Inject the secret securely in the Authorization header
    req.headers.authorization = `Bearer ${cronSecret}`;
    // Also keep as query parameter for redundancy
    req.query = { ...req.query, key: cronSecret };
    
    return await processWisdom(req, res);
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ 
      error: error.message || "Internal Proxy Error"
    });
  }
}
