# Google Maps API Setup Instructions

## Overview
The Paramedics page uses Google Maps Places API to fetch real hospital and medical facility data based on user location. **This feature requires a valid Google Maps API key to function.**

## Setup Steps

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Places API (New)
   - Maps JavaScript API
   - Geolocation API

### 2. Create API Key
1. Go to "Credentials" in the API & Services section
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key

### 3. Configure Environment Variables
1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Add your API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

### 4. API Key Restrictions (Recommended)
For security, restrict your API key:
1. In Google Cloud Console, edit your API key
2. Set "Application restrictions" to your domain
3. Set "API restrictions" to only the APIs you're using

## Features Implemented

### Real-time Hospital Search
- Fetches nearby hospitals, pharmacies, and medical facilities within 10km radius
- Uses user's geolocation for accurate results
- Fallback to default data if API fails

### Search Functionality
- Text-based search for specific hospitals or medical services
- Location-biased results prioritizing nearby facilities

### Interactive Features
- Direct phone calling for mobile devices
- Google Maps directions integration
- Distance calculation and sorting by proximity

### Error Handling
- Graceful handling of location permission denials
- API quota and authentication error messages
- Loading states and retry mechanisms

## API Endpoints Used

1. **Places Search Nearby**: `https://places.googleapis.com/v1/places:searchNearby`
   - Finds hospitals and medical facilities near user location
   - Filters by facility types (hospital, pharmacy, doctor, etc.)

2. **Places Text Search**: `https://places.googleapis.com/v1/places:searchText`
   - Searches by text query with location bias
   - Used for manual search functionality

## Data Mapping

The Google Places API responses are automatically converted to match the existing `Paramedic` interface:

```typescript
interface Paramedic {
  id: string;           // Google Place ID
  name: string;         // Display name
  location: string;     // Formatted address
  distance: string;     // Calculated distance from user
  rating: number;       // Google rating (1-5)
  phone: string;        // Phone number
  services: string[];   // Inferred from place types
  availability: boolean; // Current opening hours
  emergencyContact: boolean; // True for hospitals
}
```

## Testing
1. **Setup API Key**: Configure VITE_GOOGLE_MAPS_API_KEY in your .env file
2. **Enable Location**: Ensure location services are enabled in your browser
3. **Verify Configuration**: Check browser console for API configuration status
4. **Test Features**: Try location detection, search functionality, and map interactions
5. **Monitor Quotas**: Watch your API usage in Google Cloud Console

## Troubleshooting

### Common Issues
1. **"API key invalid"**: Check your API key and enabled services
2. **"Location denied"**: Browser location permission required  
3. **"No results"**: Check internet connection and API quotas
4. **CORS errors**: API calls are made from client-side, ensure proper restrictions
5. **400 Bad Request**: Usually indicates missing or incorrect API key configuration

### Debug Steps for 400 Errors
If you see "Invalid request parameters" errors:
1. Check browser console for detailed error messages
2. Verify API key is correctly set in `.env` file
3. Ensure Places API (New) is enabled in Google Cloud Console
4. Check API key restrictions aren't blocking requests
5. Try refreshing the page to retry API calls

### Environment Variables Debug
To check if your API key is loaded:
1. Open browser developer tools
2. Look for console message: "API Request: { apiKey: 'Present' }"
3. If it shows "Missing", check your `.env` file and restart the dev server

### Error Handling
The application provides clear error messages and guidance:
- **No API Key**: Shows setup instructions and links to Google Cloud Console
- **API Failure**: Displays specific error messages with troubleshooting steps
- **Location Denied**: Shows error message with retry option
- **Network Issues**: Graceful error handling with retry functionality

### API Key Required
**⚠️ Important: The application requires a valid Google Maps API key to function.**
- Without an API key, the app will show configuration instructions
- No mock data is provided - only real Google Places API data is used
- All hospital and medical facility data comes directly from Google Places

### Rate Limits
- Google Places API has usage quotas
- Implement caching for production use
- Consider server-side proxy for better security
- Monitor your API usage in Google Cloud Console

## Future Enhancements
- Add place photos from Google Places
- Implement caching to reduce API calls
- Add more detailed place information (reviews, hours, etc.)
- Integrate with hospital booking systems
