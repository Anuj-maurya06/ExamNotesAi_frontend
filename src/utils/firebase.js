
 
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "authexamnotes-596bd.firebaseapp.com",
  projectId: "authexamnotes-596bd",
  storageBucket: "authexamnotes-596bd.firebasestorage.app",
  messagingSenderId: "651160758921",
  appId: "1:651160758921:web:be55701a0847cdc9acb458"
};

 
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}