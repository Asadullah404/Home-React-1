

// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Your Firebase config
// // const firebaseConfig = {
// //   apiKey: process.env.VITE_FIREBASE_API_KEY,
// //   authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
// //   projectId: process.env.VITE_FIREBASE_PROJECT_ID,
// //   storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
// //   appId: process.env.VITE_FIREBASE_APP_ID,
// // };

// const firebaseConfig = {
//     apiKey: "AIzaSyCWtZfoVbBppzX2XFwCkEm3yuTX7dk2euY",
//     authDomain: "meter-app-5c838.firebaseapp.com",
//     projectId: "meter-app-5c838",
//     storageBucket: "meter-app-5c838.firebasestorage.app",
//     messagingSenderId: "936191243763",
//     appId: "1:936191243763:web:8b754c38d51bc378040e86"
//   };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider(); // Google Auth Provider
// export const firestore = getFirestore(app);

// export default app;


// firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCWtZfoVbBppzX2XFwCkEm3yuTX7dk2euY",
//   authDomain: "meter-app-5c838.firebaseapp.com",
//   projectId: "meter-app-5c838",
//   storageBucket: "meter-app-5c838.firebasestorage.app",
//   messagingSenderId: "936191243763",
//   appId: "1:936191243763:web:8b754c38d51bc378040e86",
// };

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_API_KEY,
//     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_APP_ID,
//   };
  
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // Rename 'firestore' to 'db'

export default app;
