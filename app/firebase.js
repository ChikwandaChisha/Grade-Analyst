// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAHWPpg_H8OIh7Ezi1t3GMfnj1hMEPXv-0",
  authDomain: "grade-analyst.firebaseapp.com",
  projectId: "grade-analyst",
  storageBucket: "grade-analyst.appspot.com",
  messagingSenderId: "796422474125",
  appId: "1:796422474125:web:1121c40cedd5f3bbf6d5c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)