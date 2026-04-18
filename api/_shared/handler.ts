import { generateDailyDharma } from '../../services/geminiService.js';
import { getDailyWisdom, saveDailyWisdom, db } from '../../services/firebase.js';
import { doc, updateDoc } from 'firebase/firestore';

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
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const lang = 'en';

    // 2. Resolve Wisdom (Get or Generate)
    let wisdom = await getDailyWisdom(dateKey, lang);
    
    // Check if already posted using data from initial fetch
    if (wisdom && (wisdom as any).fb_posted && !isForce) {
      return response.status(200).json({ status: 'already_posted', timestamp: (wisdom as any).fb_posted_at });
    }

    if (!wisdom) {
      console.log(`Wisdom not found for ${dateKey}, generating new one...`);
      const newDrop = await generateDailyDharma(lang);
      wisdom = { ...newDrop, timestamp: Date.now() };
      await saveDailyWisdom(dateKey, lang, wisdom);
    }

    // 4. Randomization Logic (5 AM to 5 PM GMT)
    const currentHour = date.getUTCHours();
    const startHour = 5;
    const endHour = 17;

    if (!isForce && !isManual) {
      if (currentHour < startHour || currentHour > endHour) {
        return response.status(200).json({ status: 'outside_window', hour: currentHour });
      }

      const hoursRemaining = endHour - currentHour;
      const shouldPost = hoursRemaining <= 0 || Math.random() < 1 / (hoursRemaining + 1);

      if (!shouldPost) {
        return response.status(200).json({ status: 'skipping_randomly', hour: currentHour, hoursRemaining });
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

👉 ${toBold("Start your journey today:")} https://bodhipath.lk/

🙏 May all beings be happy and peaceful.
#Buddhism #Dhamma #DailyWisdom #BodhiPath #Mindfulness #Zen
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

    const wisdomRef = doc(db, "daily_wisdom", `${dateKey}_${lang}`);
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

    const postUrl = `https://www.facebook.com/${fbResult.id}`;

    return response.status(200).json({ 
      status: 'success', 
      postId: fbResult.id,
      postUrl,
      postedToPage: meData.name,
      pageId: meData.id,
      hour: currentHour
    });

  } catch (error: any) {
    console.error("Wisdom Processor Error:", error);
    return response.status(500).json({ error: error.message });
  }
}
