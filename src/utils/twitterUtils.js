/**
 * Twitter utility functions for fetching profile images and data
 */

// API base URL - adjust this to match your deployed server URL
const API_BASE_URL = 'http://localhost:3001/api/twitter';

// Cache profile images to avoid redundant API calls
const profileImageCache = new Map();

/**
 * Get Twitter profile image URL for a single username
 * 
 * @param {string} username - Twitter username (with or without @)
 * @returns {Promise<string|null>} - URL of the profile image or null if not found
 */
export const getTwitterProfileImage = async (username) => {
  if (!username) return null;
  
  // Remove @ if present
  const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
  
  // Check cache first
  if (profileImageCache.has(cleanUsername)) {
    return profileImageCache.get(cleanUsername);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/profile-image/${cleanUsername}`);
    
    if (!response.ok) {
      console.error(`Failed to fetch Twitter profile for ${username}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.profile_image_url) {
      // Get higher quality image (remove _normal from URL)
      const highResImage = data.profile_image_url.replace('_normal', '');
      
      // Cache the result
      profileImageCache.set(cleanUsername, highResImage);
      
      return highResImage;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Twitter profile for ${username}:`, error);
    return null;
  }
};

/**
 * Fetch multiple Twitter profile images in bulk
 * 
 * @param {string[]} usernames - Array of Twitter usernames
 * @returns {Promise<Object>} - Object mapping usernames to profile image URLs
 */
export const getBulkTwitterProfileImages = async (usernames) => {
  if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
    return {};
  }
  
  // Filter out empty usernames and those already in cache
  const uncachedUsernames = usernames
    .filter(username => username && typeof username === 'string')
    .map(username => username.startsWith('@') ? username.substring(1) : username)
    .filter(username => !profileImageCache.has(username));
  
  // Return immediately if all usernames are cached
  if (uncachedUsernames.length === 0) {
    const results = {};
    usernames.forEach(username => {
      const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
      if (profileImageCache.has(cleanUsername)) {
        results[username] = profileImageCache.get(cleanUsername);
      }
    });
    return results;
  }
  
  // Fetch uncached usernames
  try {
    const response = await fetch(`${API_BASE_URL}/bulk-profile-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernames: uncachedUsernames }),
    });
    
    if (!response.ok) {
      console.error('Failed to fetch bulk Twitter profiles:', response.status);
      return {};
    }
    
    const data = await response.json();
    
    // Process results
    const results = {};
    
    // Add cached results
    usernames.forEach(username => {
      const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
      if (profileImageCache.has(cleanUsername)) {
        results[username] = profileImageCache.get(cleanUsername);
      }
    });
    
    // Add new results from API
    if (data && data.results) {
      Object.entries(data.results).forEach(([username, info]) => {
        if (info && info.profile_image_url) {
          // Get higher quality image
          const highResImage = info.profile_image_url.replace('_normal', '');
          
          // Cache the result
          profileImageCache.set(username, highResImage);
          
          // Add to results
          results[username] = highResImage;
        }
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching bulk Twitter profiles:', error);
    return {};
  }
};
