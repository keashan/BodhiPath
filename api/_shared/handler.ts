import { generateDailyDharma } from '../../services/geminiService.js';
import { getDailyWisdom, saveDailyWisdom, db } from '../../services/firebase.js';
import { doc, updateDoc, runTransaction } from 'firebase/firestore';
import { DailyDrop } from '../../types.js';

// Unicode mapping for Eye-Catching Social Media Text (Mathematical Alphanumeric Symbols)
const toBold = (text: string) => {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + (code - 97));
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + (code - 48));
    return char;
  }).join('');
};

const toItalic = (text: string) => {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (char === 'h') return String.fromCodePoint(0x210E);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + (code - 97));
    return char;
  }).join('');
};

export async function processWisdom(request: any, response: any) {
  // Health Check Mode: Call with ?check=1 to verify environment without posting
  if (request.query?.check === '1') {
    return response.status(200).json({
      status: 'health_check',
      message: 'BodhiPath API is healthy and ready.',
      nodeVersion: process.version,
      hasFetch: typeof fetch !== 'undefined',
      hasCronSecret: !!process.env.CRON_SECRET,
      hasFbPageId: !!process.env.FB_PAGE_ID,
      hasFbToken: !!process.env.FB_PAGE_ACCESS_TOKEN,
      hasGeminiKey: !!(process.env.GEMINI_API_KEY || process.env.VITE_API_KEY),
      hasFirebaseKeys: !!process.env.VITE_FIREBASE_API_KEY,
      timestamp: new Date().toISOString()
    });
  }

  console.log("--- BodhiPath Wisdom Processor ---");
  // 1. Security check for External Trigger
  const authHeader = request.headers.authorization;
  const queryKey = request.query?.key;
  const isForce = request.query?.force === '1';
  const isManual = request.query?.manual === '1';
  const cronSecret = process.env.CRON_SECRET?.trim();

  const isAuthorized = 
    (authHeader === `Bearer ${cronSecret}`) || 
    (queryKey === cronSecret);

  if (!isAuthorized) {
    return response.status(401).json({ error: 'Unauthorized: Invalid or missing secret' });
  }

  try {
    const date = new Date();
    // Use Asia/Colombo as the anchor timezone for "Daily" consistency
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    const dateKey = `${y}-${m}-${d}`;
    
    const lang = 'en';
    const wisdomRef = doc(db, "daily_wisdom", `${dateKey}_${lang}`);

    // 2. Resolve Wisdom (Get or Generate) - Part 1: Check existing
    let wisdom = await getDailyWisdom(dateKey, lang);
    if (!wisdom) {
      console.log(`Wisdom not found for ${dateKey}, generating new one...`);
      const newDrop = await generateDailyDharma(lang);
      wisdom = { ...newDrop, timestamp: Date.now() };
    }

    // 3. Claim Posting Rights with a Transaction
    // This prevents race conditions where duplicate cron calls or manual triggers hit at once.
    const claimResult = await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(wisdomRef);
      const now = Date.now();
      
      if (!docSnap.exists()) {
        // Doc doesn't exist, create it with a posting lock
        transaction.set(wisdomRef, { ...wisdom, fb_posting_lock: now });
        return { status: 'claimed', wisdom };
      }
      
      const currentData = docSnap.data();
      
      // If already posted and NOT forcing (cron usually doesn't force), skip
      if (currentData.fb_posted && !isForce) {
        return { status: 'already_posted', wisdom: currentData };
      }
      
      // Anti-race condition: If another process is currently posting (within 2 mins), wait
      if (currentData.fb_posting_lock && (now - currentData.fb_posting_lock < 120000) && !isForce) {
        return { status: 'locked' };
      }
      
      // Claim the lock and return current data
      transaction.update(wisdomRef, { fb_posting_lock: now });
      return { status: 'claimed', wisdom: currentData };
    });

    if (claimResult.status === 'already_posted') {
      return response.setHeader('Content-Type', 'text/plain').send('SKIP: A post has already been sent for today.');
    }
    
    if (claimResult.status === 'locked') {
      return response.setHeader('Content-Type', 'text/plain').send('SKIP: Posting is already in progress (locked).');
    }

    wisdom = claimResult.wisdom as DailyDrop;

    // 4. Randomization Logic (5 AM to 5 PM GMT)
    const currentHour = date.getUTCHours();
    const startHour = 5;
    const endHour = 17;

    if (!isForce && !isManual) {
      if (currentHour < startHour || currentHour > endHour) {
        return response.setHeader('Content-Type', 'text/plain').send(`SKIP: Current hour (${currentHour}) is outside the allowed 5 AM - 5 PM GMT window.`);
      }

      const hoursRemaining = endHour - currentHour;
      const shouldPost = hoursRemaining <= 0 || Math.random() < 1 / (hoursRemaining + 1);

      if (!shouldPost) {
        return response.setHeader('Content-Type', 'text/plain').send(`SKIP: Randomly deferred to a later hour. (${hoursRemaining} hours remaining in window)`);
      }
    }

    // 5. Format Post
    let fbText = `
${toBold("☸️ BODHIPATH DAILY WISDOM")}

${toItalic(`"${wisdom.quote}"`)}

📜 ${toBold("Source:")} ${wisdom.source}

✨ ${toBold("Reflection:")}
${wisdom.reflection}

---
💬 ${toItalic("Explore the Dharma further—it's easy to learn Buddhism by chatting with Bhante Bodhi on our website.")}

👉 ${toBold("Learn Buddhism with Bhante Bodhi:")} https://bodhipath.lk/

🙏 May all beings be happy and peaceful.
#Buddhism #Dhamma #DailyWisdom #BodhiPath #Mindfulness #Zen #Theravada #theravadabuddhism
    `.trim();

    if (isManual || isForce) {
      fbText += `\n\n${toItalic(`(Manual verification: ${new Date().toLocaleTimeString()})`)}`;
    }

    // 6. Post to Facebook
    const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("Facebook Access Token is missing from environment variables.");
    }

    // Verify token identity
    const meResponse = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${accessToken}`);
    const meData = await meResponse.json();

    const fbApiUrl = `https://graph.facebook.com/v20.0/me/feed`;
    const fbResponse = await fetch(fbApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: fbText,
        access_token: accessToken,
        published: true
      })
    });

    const fbResult = await fbResponse.json();

    if (!fbResponse.ok) {
        console.error("Facebook API Error:", fbResult);
        throw new Error(`Facebook API responded with ${fbResponse.status}: ${JSON.stringify(fbResult)}`);
    }

    // 7. Update Firebase
    await updateDoc(wisdomRef, {
      fb_posted: true,
      fb_posted_at: Date.now(),
      fb_post_id: fbResult.id
    });

    return response.setHeader('Content-Type', 'text/plain').send(`SUCCESS: Wisdom post sent to Facebook page "${meData.name}". ID: ${fbResult.id}`);

  } catch (error: any) {
    console.error("Wisdom Processor Error:", error);
    return response.status(500).json({ error: error.message });
  }
}
