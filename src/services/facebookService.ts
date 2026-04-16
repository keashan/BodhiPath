import axios from 'axios';

export interface FacebookPostParams {
  message: string;
  accessToken: string;
  pageId: string;
}

export const postToFacebook = async ({ message, accessToken, pageId }: FacebookPostParams) => {
  const url = `https://graph.facebook.com/v21.0/${pageId}/feed`;
  
  try {
    const response = await axios.post(url, {
      message: message,
      access_token: accessToken,
    });
    return response.data;
  } catch (error: any) {
    console.error('Facebook Post Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Failed to post to Facebook');
  }
};

/**
 * Guidance for the user to get a never-expiring Page Access Token:
 * 
 * 1. Go to Facebook Developers (developers.facebook.com) and create an App.
 * 2. Add "Facebook Login for Business" to your app.
 * 3. Use the Graph API Explorer to get a short-lived User Access Token with 'pages_manage_posts' and 'pages_read_engagement' permissions.
 * 4. Exchange the short-lived token for a long-lived User Access Token (valid for 60 days):
 *    GET /oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}
 * 5. Use the long-lived User Access Token to get the Page Access Token:
 *    GET /{user-id}/accounts?access_token={long-lived-user-token}
 * 6. The 'access_token' returned for the Page in this response will be a "never-expiring" Page Access Token (as long as the user doesn't change their password or revoke the app).
 */
