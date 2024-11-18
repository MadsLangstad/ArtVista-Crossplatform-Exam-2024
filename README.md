# ArtVista 🎨

**ArtVista** is a digital art gallery application developed for the TDS200 Crossplatform course. The app allows artists to upload their artwork, and art enthusiasts to explore, interact, and engage with the art community. It is built with React Native using Expo, NativeWind for styling, Firebase for backend services, and TypeScript for type safety.

## Table of Contents 📑

- [Main Features](#main-features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Author](#author)

## Main Features ✨

### User Experience

- **Dynamic Theme**: Support for both light and dark themes
- **Responsive Design**: Seamless experience on all devices
- **Offline Support**: Basic functionality without internet

### Authentication & Security

- **User Registration and Login**
- **Protected Routes**: Secure access to private features
- **Password Recovery**
- **Persistent Login**: Remain logged in between sessions

### Art Gallery

- **Infinite Scroll**: Dynamic loading of content
- **Advanced Search**: Search in titles, descriptions, and abstracts
- **Detailed Views**: Comprehensive information about each artwork
- **Image Compression**: Automatic optimization of uploaded images

### Social Features

- **Likes System**: Engage with artworks
- **Comment System**: Discuss art with other users
- **Voting**: Upvote/downvote system
- **Real-time Updates**: Live updates of interactions

### Artist Features

- **Profile Editing**: Customize artist profile
- **Image Uploading**: Support for camera and gallery
- **Content Management**: Edit and delete own artworks
- **Engagement Statistics**: Track likes, comments, and views

## Technologies 🛠

### Frontend

- React Native with Expo
- TypeScript for type safety
- NativeWind (Tailwind CSS for React Native)
- Expo Router for navigation

### Backend & Services

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Realtime Database

### Development Tools

- Expo CLI
- TypeScript
- ESLint & Prettier

## Installation 🚀

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ArtVista.git
cd ArtVista
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npx expo start
```

## Configuration ⚙️

1. Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_DATABASE_URL=your_database_url
EXPO_PUBLIC_PROJECT_ID=your_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_APP_ID=your_app_id
```

2. Configure Firebase:
   - Create a project in the Firebase Console
   - Enable Authentication, Firestore, and Storage
   - Download the configuration file

## Usage 📖

1. **Start Development Server**:

   ```bash
   npx expo start
   ```

2. **Testing**:

   - Use the Expo Go app for mobile testing or run on an Android/iOS emulator.

3. **Deployment**:
   - Refer to Expo’s documentation for building and deploying the app.

## Project Structure 📁

```
artvista/
├── app/                    # Application routes and screens
│   ├── (tabs)/            # Tab navigation
│   ├── (auth)/            # Authentication screens
│   └── (artwork)/         # Artwork-related screens
├── components/            # Reusable components
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── services/            # Firebase and other services
├── types/               # TypeScript type definitions
└── assets/              # Images, fonts, and other static files
```

## Future Improvements 🔮

- Implement search filters and categories
- Add support for art exhibitions
- Improve image optimization
- Implement chat functionality
- Expand offline functionality

## Author 👨‍💻

**Mads Langstad**  
TDS200 Crossplatform, Kristiania University College

## License 📄

This project is licensed under the MIT License.

---
