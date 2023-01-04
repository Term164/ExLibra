import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { serverTimestamp, getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, query, orderBy, limit, onSnapshot} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getFirebaseConfig } from './firebase-config.js';

// Your web app's Firebase configuration
const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);

let uid;
let username;
let currentGid;
let userGroups;

getAuth().onAuthStateChanged(async user => {
    uid = user.uid;
    username = user.email;
    document.getElementsByTagName("body")[0].appendChild(document.createTextNode("Current user: " + username));
    updateCurrentUserGroups();
  });


const querySnapshot = await getDocs(collection(getFirestore(), 'users'));

var userList = document.getElementById("userList");
var chatList = document.getElementById("chat");
var messageForm = document.getElementById("message-form");
var messageInputElement = document.getElementById('message');

messageForm.addEventListener('submit', onMessageFormSubmit)

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if (messageInputElement.value) {
        saveMessage(messageInputElement.value).then(function () {
        // Clear message text field and re-enable the SEND button.
        messageInputElement.value = "";
        });
    }
}

async function saveMessage(messageText) {
    // TODO 7: Push a new message to Cloud Firestore.
    try{
      await addDoc(collection(getFirestore(), `group/${currentGid}/messages`), {
        sentAt: serverTimestamp(),
        sentBy: username,
        messageText: messageText
      });
    }catch(error){
      console.error('Error writing new message to Firebase Database', error);
    }
  }

querySnapshot.forEach((user) => {
    const node = document.createElement("li");
    const textNode = document.createTextNode(user.data().email)
    const btn = document.createElement("button");

    btn.innerHTML = "Chat!"
    btn.onclick = async function(){
        loadChat(user);
    }
    node.appendChild(textNode);
    node.appendChild(btn);
    userList.appendChild(node);
    //console.log(doc.id, "=>", doc.data());
});


async function loadChat(user){
    try {
        const document = doc(getFirestore(), 'users', user.id)
        const docSnap = await getDoc(document);
        const otherUserGroups = docSnap.data().groups;
        let intersection = userGroups.filter(x => otherUserGroups.includes(x));
        console.log(intersection);

        if(intersection.length != 1){
            await addDoc(collection(getFirestore(),'group'), {
                createdAt: serverTimestamp(),
                members: [user.id, uid]
            }).then(async function (docRef){
                const testCollection = collection(getFirestore(), 'group', docRef.id, 'messages');
                await addDoc(testCollection, {sentAt: serverTimestamp(),sentBy: user.data().email, messageText: "Hello"})
                await addGroupToUser(uid, docRef.id);
                addGroupToUser(user.id, docRef.id);
                updateCurrentUserGroups();
                loadMessages(docRef.id);
            }).catch(function (error){
                console.error("Error adding subcollection: ", error)
            });
        }else{
            loadMessages(intersection[0]);
        }
    } catch (error) {
        console.error('Error when creating new chat session: ', error);
    }
    
}

function loadMessages(gid){
    currentGid = gid;
    const recentMessagesQuery = query(collection(getFirestore(), `group/${gid}/messages`), orderBy('sentAt', 'asc'), limit(12));
    //console.log("query", recentMessagesQuery);

    onSnapshot(recentMessagesQuery, function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        //console.log(change);
        if(change.type === 'removed'){
          deleteMessage(change.doc.id);
        }else if(change.type === 'added'){
          var message = change.doc.data();
          displayMessage(message.sentAt, message.sentBy, message.messageText);
        }
      });
    });
}

function displayMessage(timestamp, user, text){
    const node = document.createElement("li");
    timestamp = timestamp ? new Date(timestamp.seconds*1000) : new Date(Date.now());
    const textNode = document.createTextNode(`${user} at(${timestamp.toDateString()}): ${text}.`);
    node.appendChild(textNode);
    chatList.appendChild(node);
}

async function updateCurrentUserGroups(){
    const document = doc(getFirestore(), 'users', uid)
    const docSnap = await getDoc(document);
    userGroups = docSnap.data().groups;
}

async function addGroupToUser(uid, gid){
    const document = doc(getFirestore(), 'users', uid)
    const docSnap = await getDoc(document);
    if (docSnap.exists()) {
        const groupArray = docSnap.data().groups;
        groupArray.push(gid);
        setDoc(document, {groups: groupArray}, {merge: true});
    } else {
        console.error("No such document!");
    }
}