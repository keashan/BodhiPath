import { generateDailyDharma } from '../../services/geminiService';
import { getDailyWisdom, saveDailyWisdom, db } from '../../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

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
    // Note: Italic Serif range starts at 1D434 for A, but has gaps (e.g., lowercase 'h' 1D44E)
    // We use a simplified version here
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + (code - 97));
    return char;
  }).join('');
};

export default async function handler(request: any, response: any) {
  // 1. Security check for External Trigger
  // We allow either the Standard Authorization header OR a 'key' query parameter
  const authHeader = request.headers.authorization;
  const queryKey = request.query?.key;
  const cronSecret = process.env.CRON_SECRET;

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
    if (!wisdom) {
      console.log(`Wisdom not found for ${dateKey}, generating new one...`);
      const newDrop = await generateDailyDharma(lang);
      wisdom = { ...newDrop, timestamp: Date.now() };
      await saveDailyWisdom(dateKey, lang, wisdom);
    }

    // 3. Check if already posted to FB
    // We store metadata in a separate document or the same wisdom document
    // Let's use a 'metadata' field in the same document if possible, or a status doc
    const wisdomRef = doc(db, "daily_wisdom", `${dateKey}_${lang}`);
    const wisdomData = (await getDoc(wisdomRef)).data();
    
    if (wisdomData?.fb_posted) {
      return response.status(200).json({ status: 'already_posted', timestamp: wisdomData.fb_posted_at });
    }

    // 4. Randomization Logic (5 AM to 5 PM GMT)
    // Cron runs hourly at 0 mins. Current hour in GMT is date.getUTCHours()
    const currentHour = date.getUTCHours();
    const startHour = 5;
    const endHour = 17; // 5 PM

    if (currentHour < startHour || currentHour > endHour) {
      return response.status(200).json({ status: 'outside_window', hour: currentHour });
    }

    // Probability check: if it's the last hour, 100% chance.
    // Otherwise, 1/(hours_remaining) chance.
    const hoursRemaining = endHour - currentHour;
    const shouldPost = hoursRemaining <= 0 || Math.random() < 1 / (hoursRemaining + 1);

    if (!shouldPost) {
      return response.status(200).json({ status: 'skipping_randomly', hour: currentHour, hoursRemaining });
    }

    // 5. Format Post
    const fbText = `
${toBold("☸️ BODHIPATH DAILY WISDOM")}

${toItalic(`"${wisdom.quote}"`)}

📜 ${toBold("Source:")} ${wisdom.source}

✨ ${toBold("Reflection:")}
${wisdom.reflection}

🙏 May all beings be happy and peaceful.
#Buddhism #Dhamma #DailyWisdom #BodhiPath #Mindfulness
    `.trim();

    // 6. Post to Facebook
    const pageId = process.env.FB_PAGE_ID;
    const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      throw new Error("Facebook Page ID or Access Token is missing from environment variables.");
    }

    const fbApiUrl = `https://graph.facebook.com/v25.0/${pageId}/feed`;
    const fbResponse = await fetch(fbApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: fbText,
        access_token: accessToken
      })
    });

    const fbResult = await fbResponse.json();

    if (!fbResponse.ok) {
        console.error("Facebook API Error:", fbResult);
        throw new Error(`Facebook API responded with ${fbResponse.status}: ${JSON.stringify(fbResult)}`);
    }

    // 7. Update Firebase to prevent duplicate posting
    await updateDoc(wisdomRef, {
      fb_posted: true,
      fb_posted_at: Date.now(),
      fb_post_id: fbResult.id
    });

    return response.status(200).json({ 
      status: 'success', 
      postId: fbResult.id,
      hour: currentHour
    });

  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return response.status(500).json({ error: error.message });
  }
}
