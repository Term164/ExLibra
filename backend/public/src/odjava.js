import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import {getDatabase, set, ref, update} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getFirebaseConfig } from './firebase-config.js';

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = getFirebaseConfig();
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


logO.addEventListener('click', (e) => {
    const auth = getAuth();
    signOut(auth).then(() => {
       document.location.href = '../index.html';
  // Sign-out successful.
    }).catch((error) => {
        console.log("nedela");
    });
});