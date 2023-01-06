import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc} from "@firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseConfig } from './firebase-config.js';

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const firestore = getFirestore();


async function signInWithGoogle(){
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(getAuth(), provider);
}

async function signInDefault(email, password){
    await signInWithEmailAndPassword(getAuth(), email, password);
}

async function signOutUser(){
    signOut(getAuth());
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

export {saveUserData ,getUserData, signOutUser, getAuth, signInWithGoogle, signInDefault, registerUserDefault, getUserSignedIn, isUserSignedIn, getUserName};