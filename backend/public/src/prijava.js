import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import {getDatabase, set, ref, update} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getFirestore, doc, setDoc} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getFirebaseConfig } from './firebase-config.js';
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = getFirebaseConfig();
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  const firestore = getFirestore();

  
  googleL.addEventListener('click', (e) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    /*const docData = {
        test: "test"
    }
    setDoc(doc(firestore, 'users/test'), docData);*/
    firebase.auth().signInWithPopup(provider)
           .then(result => {
              const user = result.user;
              console.log("uspesno")
              set(ref(database, 'maili/' + user.uid), {
                email: user.email,
                username: user.displayName
              })
              document.location.href = "html/books.html";
              
          })
          .catch(console.log);
  
    
      });

    
  submitDataR.addEventListener('click', (e) => {

    var email = document.getElementById('email').value;
    var password = document.getElementById('psw').value;

    //sign up user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
           // Signed in
            const user = userCredential.user;
            console.log(user.uid);
            console.log(email, password)
            const docData = {
                email: email,
                password: password
            }
            setDoc(doc(firestore, 'users/' + user.uid), docData);
            
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


          
