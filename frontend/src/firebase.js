// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKI7xIjDgknuBApgFa0Pxzlor8pwI-0Wg",
  authDomain: "ecommerce-home-appliances.firebaseapp.com",
  projectId: "ecommerce-home-appliances",
  storageBucket: "ecommerce-home-appliances.firebasestorage.app",
  messagingSenderId: "419359272373",
  appId: "1:419359272373:web:8579701fea689cf308bdfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };