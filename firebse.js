// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBI7voKcWC8jHb4UhRjRfgJ6scsq-ogkb8",
  authDomain: "inventory-system-cd403.firebaseapp.com",
  projectId: "inventory-system-cd403",
  storageBucket: "inventory-system-cd403.appspot.com",
  messagingSenderId: "630033018066",
  appId: "1:630033018066:web:221c27e4df40865f3d510b",
  measurementId: "G-KBJGG762GB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };
