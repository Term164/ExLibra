import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where, limit} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getFirebaseConfig } from './firebase-config.js';
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = getFirebaseConfig();
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  var db = firebase.firestore();



//dodajanje userja v firestore ob vpisu z google racunom
async function dodajUser(user){
  const userRef = doc(firestore, "users/" + user.uid);
      const info = await getDoc(userRef);
      if (info.exists()) {
        console.log("Document data:", info.data());
        window.location.href = "html/books.html";
      } else {
        db.collection("users").doc(user.uid).set({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        })
        .then(function() {
          console.log("User successfully saved to Firestore");
          window.location.href = "html/books.html";
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
        console.log("Uporabnik dodan");
      }
      
}


googleL.addEventListener('click', (e) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // The signed-in user info.
      var user = result.user;
      //prestaviStran(user);
      dodajUser(user);
      
    }).catch(function(error) {
      // Handle error
    });        
})
  
    
  submitDataR.addEventListener('click', (e) => {

    var email = document.getElementById('email').value;
    var password = document.getElementById('psw').value;

    //sign up user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
           // Signed in
            const user = userCredential.user;
            const docData = {
                email: email,
                password: password
            }
            dodajOsebo(user.uid, docData)
            
            // ... user.uid
        
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            alert(errorMessage);
        });
      });

    

    submitDataL.addEventListener('click', (e) => {

    var email = document.getElementById('email').value;
    var password = document.getElementById('psw').value;
    
    // log in user
    signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    // ...
                    document.location.href = "html/books.html";
                 
                    
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
            });


          
