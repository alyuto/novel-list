// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWsmvMAROCXQjdvvYbgGW9ecRxFk5tSS8",
  authDomain: "novel-56611.firebaseapp.com",
  projectId: "novel-56611",
  storageBucket: "novel-56611.appspot.com",
  messagingSenderId: "119181929389",
  appId: "1:119181929389:web:645768f9e13763518f0f24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; // Export db here
