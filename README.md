# ArtVista

**ArtVista** is a digital art gallery application developed for the TDS200 Crossplatform course. The app allows artists to upload their artwork, and art enthusiasts to explore, interact, and engage with the art community. It is built with React Native using Expo, NativeWind for styling, Firebase for backend services, and TypeScript for type safety.

---

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ArtVista.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ArtVista
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Expo development server:
   ```bash
   npx expo start
   ```

---

## Features

- **Artwork Viewing**: Browse artworks in list or grid formats with detailed views.
- **Artist Uploads**: Securely upload artwork with images, descriptions, and hashtags.
- **Authentication**: User registration and login using Firebase, with support for social logins.
- **Navigation**: Seamless transitions between screens using React Navigation.
- **Community Interaction**: Comment on and vote for artworks.

---

## Technologies Used

- **Frontend**: React Native, Expo, NativeWind
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Image Handling**: Expo ImagePicker

---

## Setup

1. **Firebase Configuration**:

   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Email/Password Authentication** and **Google Sign-In**.
   - Set up **Firestore Database** and **Storage** for image handling.
   - Add your Firebase configuration to a `firebase.ts` file in the `/services` directory.

2. **Environment Variables**:
   - Securely configure your Firebase API keys.

---

## Usage

1. **Start Development Server**:
   ```bash
   npx expo start
   ```
2. **Testing**:

   - Use the Expo Go app for mobile testing or run on an Android/iOS emulator.

3. **Deployment**:
   - Refer to Expo’s documentation for building and deploying the app.

---

## Future Improvements

- **Search and Filtering**: Add advanced search functionality for artworks.
- **Artist Profiles**: Create detailed profiles linking to their artworks.
- **Accessibility**: Enhance support for users with disabilities.

---

## Author

- **Name**: Mads Langstad
- **Course**: TDS200 Crossplatform, Høyskolen Kristiania

---
