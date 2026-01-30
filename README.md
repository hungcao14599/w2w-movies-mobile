# W2W Movies - React Native Mobile App

A beautiful and modern Netflix-style movie streaming mobile application built with React Native and Expo.

## ✨ Features

- 🎬 Browse movies and TV shows with Netflix-style UI
- 🔥 Trending carousel with auto-scroll and beautiful animations
- 🔍 Search movies by title with real-time results
- 📱 Modern, responsive UI optimized for mobile
- 🎥 Stream movies with multiple server options
- 📺 Episode selection for TV series
- ⭐ Movie ratings and detailed information
- 🎨 Beautiful dark theme with smooth animations
- 🚀 Bottom tab navigation with modern icons
- 💫 Pull-to-refresh functionality
- 🎯 Auto-playing trending carousel

## 🎨 UI/UX Highlights

- **Modern Header**: Clean navigation with notifications and search
- **Trending Carousel**: Auto-scrolling featured movies with pagination dots
- **Netflix-Inspired Design**: Dark theme with vibrant red accents
- **Smooth Animations**: Scale effects and gradient overlays
- **Bottom Navigation**: Modern tab bar with smooth transitions
- **Category Chips**: Easy browsing with horizontal scrollable categories

## Tech Stack

- **React Native 0.81.5** - Mobile framework
- **Expo SDK 54** - Development platform
- **TypeScript** - Type safety
- **React Query 5.90** - Data fetching and caching
- **React Navigation 7.x** - Navigation with smooth animations
- **Expo Video 3.0** - Native video playback
- **Axios** - HTTP client
- **Expo Linear Gradient** - Beautiful gradient effects

## Project Structure

```
src/
├── components/        # Reusable UI components
├── constants/         # App constants (colors, etc.)
├── hooks/            # Custom React hooks
├── navigation/       # Navigation configuration
├── screens/          # Screen components
├── services/         # API services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the App

1. Start the development server:

```bash
npm start
```

or

```bash
npx expo start
```

2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### Building for Production

#### iOS

```bash
npx expo build:ios
```

#### Android

```bash
npx expo build:android
```

## API

This app uses the PhimAPI service for movie data:
- Base URL: `https://phimapi.com`

## Screens

- **Home**: Featured movies and latest updates
- **Movies**: Browse single movies
- **TV Shows**: Browse TV series
- **Search**: Search for movies by title
- **Movie Detail**: View detailed movie information
- **Watch Movie**: Stream movies with episode selection
- **Profile**: User profile and settings

## Features in Detail

### Home Screen
- Modern header with W2W branding and quick actions
- Auto-scrolling trending carousel with top 10 movies
- Pagination dots for carousel navigation
- Category chips (TV Shows, Movies, Categories)
- Multiple horizontal movie carousels with lazy loading
- Pull to refresh functionality
- Bottom tab navigation

### Trending Carousel
- Auto-scroll every 3 seconds
- Scale animation for active item
- Rank badges (1-10)
- Movie metadata (year, quality)
- Smooth transitions
- Touch to navigate

### Movie Detail Screen
- Movie poster and backdrop
- Movie information (title, year, quality, language)
- Cast and crew
- Categories and genres
- Rating and reviews
- Play button

### Watch Movie Screen
- Video player with controls
- Multiple server options
- Episode selection for TV series
- Auto-play next episode

### Search Screen
- Real-time search with debouncing
- Search results in grid layout
- Empty state handling

## Customization

### Colors

Edit `src/constants/colors.ts` to change the app's color scheme:

```typescript
export const Colors = {
  primary: '#E50914',     // Main brand color
  secondary: '#221F1F',   // Secondary background
  background: '#141414',  // Main background
  text: '#FFFFFF',        // Primary text
  textSecondary: '#999999', // Secondary text
};
```

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

## Credits

- Movie data provided by [PhimAPI](https://phimapi.com)
- Built with ❤️ using React Native and Expo
