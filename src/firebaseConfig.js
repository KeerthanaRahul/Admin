// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfIC_KkbQOaWIcfboSRD7A_hFXwtfkfNI",
  authDomain: "tasteflowbackend.firebaseapp.com",
  projectId: "tasteflowbackend",
  storageBucket: "tasteflowbackend.firebasestorage.app",
  messagingSenderId: "717386810790",
  appId: "1:717386810790:web:28a9641cac7be4194d3b67",
  measurementId: "G-QCWSQP7LWR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);