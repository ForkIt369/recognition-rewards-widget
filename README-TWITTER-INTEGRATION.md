# Twitter Profile Image Integration

This extension to the Recognition Rewards widget adds the ability to display Twitter profile photos for users who have connected their Twitter accounts.

## Features

- Automatic fetching of Twitter profile images for users with Twitter handles
- Caching to minimize API calls and improve performance
- Server-side implementation to securely handle API credentials
- Fallback to initials for users without Twitter accounts

## Setup

### 1. Install Dependencies

First, install the required server dependencies:

```bash
# From the project root
cd recognition-widget

# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `recognition-widget` directory with your Twitter API credentials:

```
# Twitter API Credentials
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret

# Server Port Settings
PORT=3001

# Cache Settings
CACHE_EXPIRY=86400000 # 24 hours in milliseconds
```

### 3. Start the Twitter API Server

Start the server that will handle Twitter API requests:

```bash
# From the server directory
npm start
```

Or use the development mode with auto-restart on file changes:

```bash
npm run dev
```

### 4. Start the Web App

In a separate terminal:

```bash
# From the project root
cd recognition-widget
npm run dev
```

## How It Works

1. When the app loads, it fetches Twitter profile images for all users with Twitter accounts
2. Images are displayed in the user rows and profile modals
3. API calls are made through the server to protect API credentials
4. Images are cached to improve performance and reduce API calls

## API Endpoints

The server provides two endpoints for Twitter profile image integration:

### Get Single Profile Image

```
GET /api/twitter/profile-image/:username
```

Returns the profile image URL for a single Twitter username.

### Get Multiple Profile Images in Bulk

```
POST /api/twitter/bulk-profile-images
```

Accepts a JSON array of Twitter usernames and returns an object mapping those usernames to their profile image URLs.

## Troubleshooting

- **Images not loading**: Check browser console for errors. Ensure the Twitter API server is running.
- **API rate limits**: If you hit Twitter API rate limits, increase the cache duration in the `.env` file.
- **CORS errors**: Ensure the server's CORS settings allow requests from your development URL.
