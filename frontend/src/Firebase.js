import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "@firebase/firestore";
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

function isUserSignedIn() {
    return !!getAuth().currentUser;
}

function getUserSignedIn() {
    return getAuth().currentUser;
}

function getUserName() {
    // TODO 5: Return the user's display name.
    return getAuth().currentUser.displayName;
}

// Initiate firebase auth
function initFirebaseAuth() {
    getAuth().onAuthStateChanged(getAuth(), authStateObserver);
}

function authStateObserver(user) {
    if (user) {
      // User is signed in!
      // Get the signed-in user's profile pic and name.
      var profilePicUrl = getAuth().getProfilePicUrl();
      var userName = getUserName();
  
      // Set the user's profile pic and name.
      getAuth().userPicElement.style.backgroundImage =
        'url(' + getAuth().addSizeToGoogleProfilePic(profilePicUrl) + ')';
      getAuth().userNameElement.textContent = userName;
  
      // Show user's profile and sign-out button.
      getAuth().userNameElement.removeAttribute('hidden');
      getAuth().userPicElement.removeAttribute('hidden');
      getAuth().signOutButtonElement.removeAttribute('hidden');
  
      // Hide sign-in button.
      getAuth().signInButtonElement.setAttribute('hidden', 'true');
  
      // We save the Firebase Messaging Device token and enable notifications.
      getAuth().saveMessagingDeviceToken();
    } else {
      // User is signed out!
      // Hide user's profile and sign-out button.
      getAuth().userNameElement.setAttribute('hidden', 'true');
      getAuth().userPicElement.setAttribute('hidden', 'true');
      getAuth().signOutButtonElement.setAttribute('hidden', 'true');
  
      // Show sign-in button.
      getAuth().signInButtonElement.removeAttribute('hidden');
    }
}

export {getAuth, signInWithGoogle, signInDefault, registerUserDefault, getUserSignedIn, isUserSignedIn, getUserName};