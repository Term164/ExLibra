import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
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
  


  function dodajOsebo(uid, data){
    setDoc(doc(firestore, 'users/' + uid), data);
  }

googleL.addEventListener('click', (e) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
           .then(result => {
                const user = result.user;
                //const colRef = collection(firestore, "users");
                console.log(user.email)
                const docData = {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                }
                dodajOsebo(user.uid, docData)
                document.location.href = "html/books.html";
                
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


          
