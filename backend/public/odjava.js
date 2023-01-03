import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import {getDatabase, set, ref, update} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDe8074PwjBQGoMrGvl0UU-RVL0dRTlye0",
    authDomain: "exlibra-563bd.firebaseapp.com",
    projectId: "exlibra-563bd",
    storageBucket: "exlibra-563bd.appspot.com",
    messagingSenderId: "60246911702",
    appId: "1:60246911702:web:c6dfc71fbe0db8de1fb777"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);



logO.addEventListener('click', (e) => {
    console.log("neki");
    const auth = getAuth();
    signOut(auth).then(() => {
       document.location.href = '../index.html';
        console.log("dela");
  // Sign-out successful.
    }).catch((error) => {
        console.log("nedela");
    });
});