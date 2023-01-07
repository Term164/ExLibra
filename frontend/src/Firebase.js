import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where, limit, addDoc, deleteDoc, updateDoc} from "@firebase/firestore";
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

async function saveUserData(name, surname, username, email, tel){
    const documentReference = doc(firestore, "users", getAuth().currentUser.uid);
    await setDoc(documentReference, {
       name: name,
       surname: surname,
       username: username,
       tel: tel
    }, {merge: true});
}

async function getBooks(){
    const colRef = collection(firestore, "books");
    const q = query(colRef)
    const docsSnap = await getDocs(q);
    docsSnap.forEach(doc => {
        //console.log(doc.id + ":");
        //console.log(doc.data().ime, doc.data().faks, doc.data().predmet);
    })
}


async function getBook(id) {
    const colRef = collection(firestore, "books");
    const q = query(colRef);
    const docsSnap = await getDocs(q);
    let book;
    docsSnap.forEach(doc => {
        if (id == doc.id) {
            book = doc;
            return;
        }
    });
    if (!book) {
        throw new Error(`Book with ID ${id} not found`);
    }
    return book;
}

async function getOglas() {
    const colRef = collection(firestore, "oglas");
    const q = query(colRef);
    const docsSnap = await getDocs(q);
    const knjList = [];
    const docSnapshots = docsSnap.docs;
    for (var i in docSnapshots) {
        const data = docSnapshots[i].data();
        //console.log(data);
        const bid = data.knjiga.id;
        const knj = await getBook(bid);
        const bData = knj.data();
        //console.log(bData);
        knjList.push({id: bid, slika: data.urlslike, ime: bData.ime, faksi: bData.faks, time: bData.letoizdaje.seconds, predmeti: bData.predmet, opis: data.opis, cena: data.cena});
    }
    return knjList;
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

export {saveNewUserData, saveUserData ,getUserData, signOutUser, getAuth, signInWithGoogle, signInDefault, registerUserDefault, getUserSignedIn, isUserSignedIn, getUserName, getBooks, getOglas};