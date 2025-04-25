import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// Twitter API credentials
const TWITTER_API_KEY = process.env.TWITTER_API_KEY || 'FeUjcigFfPNBdtTETCkTvGN1m';
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || 'O3f7IfyASCaVOiT50waTuq2POSK4FzpJ3RZedDkEQ5boyoMdHn';

// Cache to store profile images (in-memory for simplicity)
const profileImageCache = new Map();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Get Bearer Token from Twitter
async function getTwitterBearerToken() {
  try {
    const tokenCredentials = Buffer.from(`${TWITTER_API_KEY}:${TWITTER_API_SECRET}`).toString('base64');
    
    const response = await axios.post('https://api.twitter.com/oauth2/token', 
      'grant_type=client_credentials', 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': `Basic ${tokenCredentials}`
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining Twitter bearer token:', error.message);
    throw new Error('Failed to obtain Twitter API access token');
  }
}

// Get Twitter user info by username
async function getTwitterUserInfo(username, bearerToken) {
  try {
    // Remove @ symbol if present
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    // Check cache first
    if (profileImageCache.has(cleanUsername)) {
      const cachedData = profileImageCache.get(cleanUsername);
      
      // Check if cached data is still valid
      if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
        return cachedData.data;
      }
    }
    
    // If not in cache or expired, make API request
    const response = await axios.get(`https://api.twitter.com/2/users/by/username/${cleanUsername}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      },
      params: {
        'user.fields': 'profile_image_url,name,description'
      }
    });
    
    // Store in cache
    if (response.data.data) {
      profileImageCache.set(cleanUsername, {
        data: response.data.data,
        timestamp: Date.now()
      });
    }
    
    return response.data.data;
  } catch (error) {
    console.error(`Error getting Twitter user info for ${username}:`, error.message);
    return null;
  }
}

// Endpoint to get Twitter profile image by username
app.get('/api/twitter/profile-image/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    // Get bearer token
    const bearerToken = await getTwitterBearerToken();
    
    // Get user info
    const userInfo = await getTwitterUserInfo(username, bearerToken);
    
    if (!userInfo) {
      return res.status(404).json({ error: 'Twitter user not found' });
    }
    
    // Return profile image URL
    res.json({ 
      profile_image_url: userInfo.profile_image_url,
      name: userInfo.name
    });
  } catch (error) {
    console.error('Error fetching Twitter profile image:', error);
    res.status(500).json({ error: 'Failed to fetch Twitter profile image' });
  }
});

// Endpoint to get multiple Twitter profile images
app.post('/api/twitter/bulk-profile-images', async (req, res) => {
  try {
    const { usernames } = req.body;
    
    if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
      return res.status(400).json({ error: 'Valid usernames array is required' });
    }
    
    // Get bearer token
    const bearerToken = await getTwitterBearerToken();
    
    // Process up to 100 usernames at a time (Twitter API limit)
    const MAX_BATCH_SIZE = 100;
    const batches = [];
    
    for (let i = 0; i < usernames.length; i += MAX_BATCH_SIZE) {
      batches.push(usernames.slice(i, i + MAX_BATCH_SIZE));
    }
    
    // Results object to return
    const results = {};
    
    // Process each batch
    for (const batch of batches) {
      const validUsernames = batch.filter(username => username && typeof username === 'string');
      
      // Get user info for each username
      const userInfoPromises = validUsernames.map(username => {
        return getTwitterUserInfo(username, bearerToken)
          .then(userInfo => ({ username, userInfo }));
      });
      
      const usersInfo = await Promise.all(userInfoPromises);
      
      // Add to results
      usersInfo.forEach(({ username, userInfo }) => {
        if (userInfo) {
          results[username] = {
            profile_image_url: userInfo.profile_image_url,
            name: userInfo.name
          };
        }
      });
    }
    
    res.json({ results });
  } catch (error) {
    console.error('Error fetching bulk Twitter profile images:', error);
    res.status(500).json({ error: 'Failed to fetch Twitter profile images' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Twitter API server running on port ${PORT}`);
});
