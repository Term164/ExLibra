import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "@firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseConfig } from './firebase-config.js';

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore();


async function signInWithGoogle(){
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);    
}

async function signInDefault(email, password){
    await signInWithEmailAndPassword(getAuth(), email, password);
}


export {signInWithGoogle, signInDefault};