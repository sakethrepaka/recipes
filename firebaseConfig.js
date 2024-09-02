// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getAuth} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCW7EvohZjq3UW5qUQxfioETJIhrtGvQbA",
  authDomain: "recipes-signup.firebaseapp.com",
  projectId: "recipes-signup",
  storageBucket: "recipes-signup.appspot.com",
  messagingSenderId: "988923785385",
  appId: "1:988923785385:web:088ac1df7ff51a8f0a79b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app
