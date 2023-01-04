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

async function registerUserDefault(email, password, username){
    await createUserWithEmailAndPassword(getAuth(),email,password).then((userCredential) => {
        const docData = {
            email: email,
            password: password,
            groups: [],
            username: username,
            name: "",
            surname: "",
            tel: "",
            profileurl: "/pfp/default.png",
            ads: [],
            wishlist: [],
        }
        setDoc(doc(firestore, `users/${userCredential.user.uid}`), docData);
    });
}

async function saveNewUserData(){

}


export {signInWithGoogle, signInDefault, registerUserDefault};