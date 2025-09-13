# Firebase Authentication Setup

This project includes Firebase authentication with login and signup functionality. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name and follow the setup wizard
4. Enable Google Analytics if desired

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication

## 3. Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Set Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase configuration.

## 5. Test the Application

1. Run `npm run dev` to start the development server
2. Navigate to `http://localhost:5173`
3. You should be redirected to the login page
4. Create a new account or sign in with existing credentials

## Features

- **Login Page**: Email/password authentication
- **Sign Up Page**: Create new accounts with email/password
- **Protected Routes**: Main dashboard is protected and requires authentication
- **User Display**: Shows logged-in user's name/email
- **Logout**: Sign out functionality

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Firebase handles password hashing and security automatically
