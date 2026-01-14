// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDade0xBOGdh-ty13YT2cD7tCi5T7uo1mY",
  authDomain: "agentforge-75916.firebaseapp.com",
  projectId: "agentforge-75916",
  storageBucket: "agentforge-75916.firebasestorage.app",
  messagingSenderId: "491817117036",
  appId: "1:491817117036:web:d8e1fcddc7f6b7f3a53f49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth (we will use this everywhere)
export const auth = getAuth(app);

export default app;