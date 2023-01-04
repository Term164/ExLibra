import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import {getDatabase, set, ref, update, onValue} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getFirebaseConfig } from './firebase-config.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = getFirebaseConfig();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

//pridobitev UID od user
getAuth().onAuthStateChanged(user =>{
  console.log(user);
});


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    const mail = user.email;
    var postElement = document.getElementById("postElement");
    // here I will assume that this function simply 
    // updates the contents of the element with a value
    var updateStarCount = function(element, value) {
        element.textContent = "Hello there " + value;
    };
    const starCountRef = ref(db, 'users/');
    onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();

    
    //var json = JSON.parse(data["8Qu6Ud2rVoZ0T2cNnzCvdMhgwrj2"])
    
    //updateStarCount(postElement, data[user.uid]["email"]);
    updateStarCount(postElement, user.email);
    //console.log(user.email);
    console.log(user.displayName)
    console.log(user.email)
    console.log(user.uid)
    });
    //console.log(mail)
    // ...
  } else {
    // User is signed out
    // ...
  }
});
    
    