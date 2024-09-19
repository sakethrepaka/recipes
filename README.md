# Recipe Mobile Application

This is a React Native mobile recipe application built using Expo. It allows users to search, add, modify, and delete recipes. The app integrates with external recipe APIs for fetching new recipes and the YouTube API for recipe-related videos. It also includes features such as Google authentication, a chatbot powered by Firebase, and a responsive UI with light/dark mode support.

## Features

- **Recipe Management:**
  - Add new recipes.
  - Modify existing recipes.
  - Delete recipes.
  - Search and filter recipes with a dynamic search bar and dropdown with debouncing effects.
  
- **External API Integrations:**
  - Fetch the latest recipes from an external recipe API.
  - YouTube API integration to fetch videos related to specific recipes.

- **Search Bar with Debouncing:**
  - Implements a search bar with dropdown suggestions.
  - Includes debouncing for better performance and fewer API calls.

- **Authentication:**
  - Google authentication for user login.

- **Chatbot:**
  - Chat feature powered by Firebase, using an automated chatbot that fetches responses based on user queries about recipes and external APIs.

- **State Management:**
  - Context API for managing global state.
  - Supports light and dark modes for a customizable UI theme.

## Tech Stack

- **Frontend:**
  - React Native
  - Expo
  - Context API for state management
  - React Navigation for app navigation
  - Light/Dark Mode theming

- **APIs:**
  - External recipe API (for fetching new recipes)
  - YouTube API (for fetching recipe-related videos)
  - Firebase (for authentication and chatbot integration)

- **Authentication:**
  - Google authentication using Firebase.

- **Database:**
  - Firebase Realtime Database for storing user-specific data like saved recipes and chat responses.

