import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc} from "@firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseConfig } from './firebase-config.js';

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const firestore = getFirestore();


async function signInWithGoogle(){
    const provider = new GoogleAuthProvider();
    let user = await signInWithPopup(getAuth(), provider);

    const uid = user.user.uid;
    let userRef = doc(firestore, "users", uid);
    const userData = await getDoc(userRef);

    if(!userData.exists()){
        try {
            await saveNewUserData(uid, user.user.displayName, user.user.email);
        } catch (error) {
            console.error("Error saving new user data: ", error);
        }
    }
}

async function signInDefault(email, password){
    await signInWithEmailAndPassword(getAuth(), email, password);
}

async function signOutUser(){
    signOut(getAuth());
}

async function registerUserDefault(email, password, username){
    let user = await createUserWithEmailAndPassword(getAuth(),email,password);

    const uid = user.user.uid;
    let userRef = doc(firestore, "users", uid);
    const userData = await getDoc(userRef);

    if(!userData.exists()){
        try {
            await saveNewUserData(uid, username, email);
        } catch (error) {
            console.error("Error saving new user data: ", error);
        }
    }
}

async function saveNewUserData(uid, username, email){
    const docData = {
        email: email,
        groups: [],
        username: username,
        password: "",
        name: "",
        surname: "",
        tel: "",
        profileurl: "/pfp/default.png",
        ads: [],
        wishlist: [],
    }
    await setDoc(doc(firestore, `users`, uid), docData);
}

async function getUserData() {
    const documentReference = doc(firestore, "users", getAuth().currentUser.uid);
    try{
        const document = await getDoc(documentReference);
        if(document.exists()){
            //console.log("Document data:", document.data());
            return document.data();
        }else{
            console.log("No such document!");
        }
    }   catch (e){
        console.error("Error getting user data: ", e);
    } 
}

async function saveUserData(name, surname, username, tel){
    const documentReference = doc(firestore, "users", getAuth().currentUser.uid);
    await setDoc(documentReference, {
       name: name,
       surname: surname,
       username: username,
       tel: tel 
    }, {merge: true});
}

function isUserSignedIn() {
    return !!getAuth().currentUser;
}

function getUserSignedIn() {
    return getAuth().currentUser;
}

function getUserName() {
    return getAuth().currentUser.displayName;
}

export {saveNewUserData, saveUserData ,getUserData, signOutUser, getAuth, signInWithGoogle, signInDefault, registerUserDefault, getUserSignedIn, isUserSignedIn, getUserName};