# Development Mode

The OpenStreetMap Localization tool includes a development mode that allows you to test the application without authenticating with OpenStreetMap.

## Features

When development mode is enabled:

- **No Authentication Required**: The app automatically logs you in with a mock user
- **Safe Testing**: No actual updates are sent to OpenStreetMap
- **UI Testing**: You can test all UI features without affecting real data
- **Simulated API Calls**: Update operations are simulated with success messages

## How to Enable Development Mode

### Option 1: Using Environment Variable (Recommended)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set:
   ```
   REACT_APP_DEV_MODE=true
   ```

3. Restart the development server:
   ```bash
   npm start
   ```

### Option 2: Modify Code Directly (Not Recommended)

Edit `src/config/auth.js` and change:
```javascript
const DEV_MODE = true; // Change this line
```

## Mock User Data

In development mode, you'll be logged in as a mock user with the following properties:

- **Display Name**: Dev User
- **User ID**: 999999
- **Languages**: English (en)
- **No real OSM account data**

## What Gets Simulated

- ✅ **Login**: Automatic mock user login
- ✅ **Item Updates**: Simulated success without API calls
- ✅ **Changeset Operations**: Simulated without creating real changesets
- ✅ **Map Tiles**: Uses standard OpenStreetMap tiles instead of TracesTrack tiles
- ⚠️ **Map Data Fetching**: Still queries real Overpass API for map data

## Important Notes

⚠️ **WARNING**: Development mode is for testing purposes only!

- Do NOT use in production
- The `.env` file is gitignored to prevent accidental commits
- Always disable dev mode before deploying
- Real map data is still fetched from Overpass API
- Map tiles are switched to standard OSM tiles (https://tile.openstreetmap.org) in dev mode

## Console Messages

When dev mode is active, you'll see console messages:
- `"Development mode activated - authentication bypassed"`
- `"[DEV MODE] Items simulation - no actual update sent to OSM."`
- `"[DEV MODE] Changeset close simulated - no actual API call"`

## Troubleshooting

**Dev mode not working?**
1. Make sure you've set `REACT_APP_DEV_MODE=true` in `.env`
2. Restart the development server completely
3. Check the browser console for dev mode activation messages
4. Clear browser cache and cookies

**Need to switch back to normal mode?**
1. Set `REACT_APP_DEV_MODE=false` in `.env`
2. Or delete the `.env` file
3. Restart the development server
