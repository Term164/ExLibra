import { initializeApp } from "firebase/app";
import { query, orderBy, onSnapshot, serverTimestamp, getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc} from "@firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
        profileurl: "/pfp/default.png",
        ads: [],
        wishlist: [],
    }
    await setDoc(doc(firestore, `users`, uid), docData);
}

async function getUserData() {
    return getSpecificUserData(getAuth().currentUser.uid);
}

async function getSpecificUserData(uid){
    const documentReference = doc(firestore, "users", uid);
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

        allGroupChats.push({username: otherUserData.username, gid: group});
    }));

    // user.groups.forEach(async group =>{
    //     const groupData = await getGroupData(group);
    //     let otherUserData;
    //     if(groupData.members[0] == currentUserId){
    //         otherUserData = await getSpecificUserData(groupData.members[1]);
    //     }else{
    //         otherUserData = await getSpecificUserData(groupData.members[0]);
    //     }

    //     allGroupChats.push({username: otherUserData.username, gid: group});
    // });

    return allGroupChats;
}

async function getGroupData(gid){
    const groupReference = doc(firestore, "group", gid);
    try{
        const document = await getDoc(groupReference);
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

function loadMessages(gid, addNewMessage){
    if(unsubscribe) unsubscribe();

    const recentMessagesQuery = query(collection(getFirestore(), `group/${gid}/messages`), orderBy('sentAt', 'asc'));
    unsubscribe = onSnapshot(recentMessagesQuery, function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        //console.log(change.doc.data());
        if(change.type === 'removed'){
          //deleteMessage(change.doc.id);
        }else if(change.type === 'added'){
            addNewMessage(change.doc.data());
        }
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


export { getListOfAllChats ,getSpecificUserData ,getGroupData ,saveMessage, loadMessages, createNewChatGroup, getAllUsers, saveNewUserData, saveUserData ,getUserData, signOutUser, getAuth, signInWithGoogle, signInDefault, registerUserDefault, getUserSignedIn, isUserSignedIn, getUserName};