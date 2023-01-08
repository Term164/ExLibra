import { initializeApp } from "firebase/app";
import { orderBy, onSnapshot, serverTimestamp, getFirestore, doc, setDoc, getDoc, getDocs, collection, query, addDoc, updateDoc, arrayUnion, where} from "@firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ref, getStorage, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getFirebaseConfig } from './firebase-config.js';

const firebaseConfig = getFirebaseConfig();
initializeApp(firebaseConfig);
const firestore = getFirestore();
let unsubscribe;


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
        profileurl: "https://firebasestorage.googleapis.com/v0/b/exlibra-563bd.appspot.com/o/pfp%2Fdefault.png?alt=media&token=aa0a928f-af17-4f5a-b835-cc53305ee0a4",
        ads: [],
        wishlist: [],
    }
    await setDoc(doc(firestore, `users`, uid), docData);
}

async function saveAddImage(file){
    const filePath = `slikaoglasa/${getAuth().currentUser.uid}/${file.name}`;
    return await saveImage(file, filePath);
}


async function saveProfileImage(file){
    const filePath = `pfp/${getAuth().currentUser.uid}/${file.name}`;
    return await saveImage(file, filePath);
}

async function saveImage(file, filePath){
    const newImageRef = ref(getStorage(), filePath);
    await uploadBytesResumable(newImageRef, file);
    const publicImageUrl = await getDownloadURL(newImageRef);
    return publicImageUrl;
}


async function getUserData() {
    return getSpecificUserData(getAuth().currentUser.uid);
}

async function getSpecificUserData(uid){
    const documentReference = doc(firestore, "users", uid);
    try{
        const document = await getDoc(documentReference);
        if(document.exists()){
            return document.data();
        }else{
            console.log("No such document!");
        }
    }   catch (e){
        console.error("Error getting user data: ", e);
    } 
}

async function getGroupData(gid){
    const groupReference = doc(firestore, "group", gid);
    try{
        const document = await getDoc(groupReference);
        if(document.exists()){
            return document.data();
        }else{
            console.log("No such document!");
        }
    }   catch (e){
        console.error("Error getting user data: ", e);
    }
}


async function getListOfAllChats(user){
    
    const allGroupChats = [];
    const currentUserId = await getAuth().currentUser.uid;

    await Promise.all(user.groups.map(async (group) =>{
        const groupData = await getGroupData(group);
        let otherUserData;
        if(groupData.members[0] === currentUserId){
            otherUserData = await getSpecificUserData(groupData.members[1]);
        }else{
            otherUserData = await getSpecificUserData(groupData.members[0]);
        }

        allGroupChats.push({username: otherUserData.username, gid: group, url: otherUserData.profileurl});
    }));

    return allGroupChats;
}

async function saveUserData(name, imeSlike, surname, username, email, tel){
    const documentReference = doc(firestore, "users", getAuth().currentUser.uid);
    console.log(imeSlike.fullPath);
    await setDoc(documentReference, {
       name: name,
       profileurl: imeSlike,
       surname: surname,
       username: username,
       tel: tel
    }, {merge: true});
}

async function getBooks() {
    const colRef = collection(firestore, "books");
    const q = query(colRef)
    const docsSnap = await getDocs(q);
    const knjList = {};
    const docSnapshots = docsSnap.docs;
    for (var i in docSnapshots) {
        const data = docSnapshots[i].data();
        const id = docSnapshots[i].id;
        knjList[id] = {ime: data.ime, faksi: data.faks, predmeti: data.predmet};
    }
    return knjList;
}


async function getBook(id) {
    const colRef = collection(firestore, "books");
    const q = query(colRef);
    const docsSnap = await getDocs(q);
    let book;
    docsSnap.forEach(doc => {
        if (id === doc.id) {
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
    const order = document.getElementById("order").value;
    const price = document.getElementById("maxPrice").value;
    let colRef = collection(firestore, "oglas");

    //where("cena", "<", Number(price)),
    switch (order) {
        case "costLow":
            colRef = query(colRef,  orderBy("cena"));
            break;
          
        case "costHigh":
            colRef = query(colRef, orderBy("cena", "desc"));
            break;

        case "new":
            colRef = query(colRef, orderBy("datum", "desc"));
            break;
        case "old":
            colRef = query(colRef, orderBy("datum", "asc"));
            break;      
    }

    console.log(colRef)
    //const q = query(colRef);
    const docsSnap = await getDocs(colRef);
    const knjList = [];
    const docSnapshots = docsSnap.docs;
    for (var i in docSnapshots) {
        const data = docSnapshots[i].data();
        const bid = data.knjiga.id;
        const knj = await getBook(bid);
        const bData = knj.data();
        knjList.push({id: docSnapshots[i].id, slika: data.urlslike, ime: bData.ime, faksi: bData.faks, time: bData.letoizdaje.seconds, predmeti: bData.predmet, opis: data.opis, cena: data.cena});
    }
    return knjList;
}
async function addOglas(opis, cena, bid, url){
    let user = getUserSignedIn().uid;
    let knjRef = doc(firestore, 'books/' + bid);
    let datum = Date();
    console.log(datum);
    const usrRef = doc(firestore, "users", user);
    
    const docRef = await addDoc(collection(firestore, "oglas"), {
        cena: Number(cena),
        knjiga: knjRef,
        //lokacija: "neki",
        opis: opis,
        prodajalec: '/users/' + user,
        prodano: false,
        datum: datum,
        urlslike: url
      });
    console.log(docRef.id);
    await updateDoc(usrRef, {
        ads: arrayUnion(docRef.id)
    });
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

async function getAllUsers(){
    return await getDocs(collection(firestore, 'users'));
}


async function createNewChatGroup(currentUser, otherUserId){
    try {
        const userRef = doc(firestore, 'users', otherUserId);
        const userData = await getDoc(userRef);
        const otherUserGroups = userData.data().groups;
        let intersection = currentUser.groups.filter(x => otherUserGroups.includes(x));
        const currentUserUid = getAuth().currentUser.uid;

        if(intersection.length < 1){
            await addDoc(collection(firestore, 'group'), {
                createdAt: serverTimestamp(),
                members: [currentUserUid, otherUserId]
            }).then(async function(docRef){
                await addGroupToUser(currentUserUid, docRef.id);
                addGroupToUser(otherUserId, docRef.id);
            });
        }
    } catch (error) {
        console.error("Error when loading chat messages:", error);
    }
}

async function addGroupToUser(uid, gid){
    const document = doc(firestore, 'users', uid)
    const docSnap = await getDoc(document);
    if (docSnap.exists()) {
        const groupArray = docSnap.data().groups;
        groupArray.push(gid);
        setDoc(document, {groups: groupArray}, {merge: true});
    } else {
        console.error("No such document!");
    }
}

function loadMessages(gid, addNewMessage) {
    if (unsubscribe) unsubscribe();
    
    const recentMessagesQuery = query(collection(getFirestore(), `group/${gid}/messages`),orderBy('sentAt', 'asc'));
  
    return new Promise((resolve) => {
        unsubscribe = onSnapshot(recentMessagesQuery, function (snapshot) {
            const changes = snapshot.docChanges();
            for (let i = 0; i < changes.length; i++) {
                const change = changes[i];
                //console.log(change.doc.data());
                if (change.type === 'removed') {
                    //deleteMessage(change.doc.id);
                } else if (change.type === 'added') {
                    addNewMessage(change.doc.data());
                }
            }
            resolve();
        });
    });
}

async function saveMessage(gid, username, messageText) {
    try{
      await addDoc(collection(firestore, `group/${gid}/messages`), {
        sentAt: serverTimestamp(),
        sentBy: username,
        messageText: messageText
      });
    }catch(error){
      console.error('Error writing new message to Firebase Database', error);
    }
}


export { saveAddImage, saveProfileImage, getListOfAllChats ,getSpecificUserData ,getGroupData ,saveMessage, loadMessages, createNewChatGroup, getAllUsers, saveNewUserData, saveUserData ,getUserData, signOutUser, getAuth, signInWithGoogle, signInDefault, registerUserDefault, getUserSignedIn, isUserSignedIn, getUserName, getOglas, getBooks, addOglas};