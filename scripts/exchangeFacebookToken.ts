/**
 * UTILITY: Facebook Permanent Page Access Token Generator
 * Version: Graph API v25.0
 * 
 * Instructions:
 * 1. Fill in the variables below OR set them as environment variables.
 * 2. Run this script using 'npx tsx scripts/exchangeFacebookToken.ts'
 * 3. The output will be your permanent "Never Expire" Page Token.
 */

const CONFIG = {
  APP_ID: process.env.FB_APP_ID || "YOUR_APP_ID",
  APP_SECRET: process.env.FB_APP_SECRET || "YOUR_APP_SECRET",
  PAGE_ID: process.env.FB_PAGE_ID || "YOUR_PAGE_ID",
  // Get this from Graph API Explorer: https://developers.facebook.com/tools/explorer/
  SHORT_LIVED_USER_TOKEN: "PASTE_YOUR_SHORT_LIVED_TOKEN_HERE",
  API_VERSION: "v25.0"
};

async function exchangeToken() {
  console.log(`🚀 Starting Token Exchange (API ${CONFIG.API_VERSION})...`);

  try {
    // STEP 1: Exchange short-lived User Token for a Long-lived (60 days) User Token
    console.log("--- Step 1: Generating Long-lived User Token ---");
    const step1Url = `https://graph.facebook.com/${CONFIG.API_VERSION}/oauth/access_token?` + 
      new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: CONFIG.APP_ID,
        client_secret: CONFIG.APP_SECRET,
        fb_exchange_token: CONFIG.SHORT_LIVED_USER_TOKEN
      });

    const step1Response = await fetch(step1Url);
    const step1Data = await step1Response.json();

    if (!step1Response.ok) {
      throw new Error(`Step 1 Failed: ${JSON.stringify(step1Data)}`);
    }

    const longLivedUserToken = step1Data.access_token;
    console.log("✅ Success: Long-lived User Token generated.");

    // STEP 2: Exchange Long-lived User Token for a PERMANENT Page Token
    console.log("\n--- Step 2: Generating Permanent Page Access Token ---");
    const step2Url = `https://graph.facebook.com/${CONFIG.API_VERSION}/${CONFIG.PAGE_ID}?` +
      new URLSearchParams({
        fields: 'access_token',
        access_token: longLivedUserToken
      });

    const step2Response = await fetch(step2Url);
    const step2Data = await step2Response.json();

    if (!step2Response.ok) {
      throw new Error(`Step 2 Failed: ${JSON.stringify(step2Data)}`);
    }

    const permanentPageToken = step2Data.access_token;

    console.log("\n" + "=".repeat(50));
    console.log("🎉 PERMANENT PAGE ACCESS TOKEN GENERATED!");
    console.log("=".repeat(50));
    console.log(`\n${permanentPageToken}\n`);
    console.log("=".repeat(50));
    console.log("DIRECTIONS: Copy the token above and save it as FB_PAGE_ACCESS_TOKEN in your Vercel secrets.");
    console.log("Check it here: https://developers.facebook.com/tools/debug/accesstoken/");
    console.log("=".repeat(50));

  } catch (error: any) {
    console.error("\n❌ ERROR during token exchange:");
    console.error(error.message);
    console.log("\nTip: Ensure your App ID, App Secret, and Page ID are correct and your short-lived token has 'pages_manage_posts' permission.");
  }
}

// Run the script
if (CONFIG.SHORT_LIVED_USER_TOKEN === "PASTE_YOUR_SHORT_LIVED_TOKEN_HERE") {
    console.error("❌ ERROR: Please paste your short-lived user token into the script at scripts/exchangeFacebookToken.ts");
} else {
    exchangeToken();
}
