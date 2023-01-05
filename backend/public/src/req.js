
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirebaseConfig } from './firebase-config.js';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where, limit, addDoc, deleteDoc, updateDoc  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
const firebaseConfig = getFirebaseConfig();
    
    // Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let uid = "";    
   
    
    
    
//get podatki uporabnika
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
        uid = user.uid;
        console.log(uid);

        // ...
    } else {
        // User is signed out
        // ...
    }
});

async function getUser(){
    const docRef = doc(firestore, "users/"+uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("Uporabnika ni mogoce najti!");
    }
}
//update podatki uporabnika
async function updateUser(novoUpo){
    const docRef = doc(firestore, "users/"+uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userRef = docRef

        // Set the "capital" field of the city 'DC'
        await updateDoc(userRef, {
            username: novoUpo
        });
    } else {
    // doc.data() will be undefined in this case
    console.log("Uporabnika ni mogoce najti!");
}
}

async function getBooks(){
    const colRef = collection(firestore, "books");
    const q = query(colRef)
    const docsSnap = await getDocs(q);
    docsSnap.forEach(doc => {
        console.log(doc.id + " => " + doc.data());
    })
}
//add oglas
async function addOglas(){
    const docRef = await addDoc(collection(firestore, "oglas"), {
        cena: "neki",
        knjiga: "neki",
        lokacija: "neki",
        opis: "neki",
        prodajalec: '/users/' + 'uid uporabnika',
        prodano: false,
        urlslike: "slika.png"
      });
    console.log("oglas dodan");
}
async function delOglas(oglasid){
    await deleteDoc(doc(firestore, "oglas/" + oglasid));
    console.log("oglas/" + oglasid);
    console.log("oglas izbrisan");
}
async function getOglas(){
    const colRef = collection(firestore, "oglas");
    const q = query(colRef)

    
    const docsSnap = await getDocs(q);
    docsSnap.forEach(doc => {
        console.log(doc.data());
    })
}

getKnjige.addEventListener('click', (e) => {
        getBooks();
   
});
getOglasi.addEventListener('click', (e) => {
    getOglas();

});
addOgl.addEventListener('click', (e) => {
    addOglas();

});
delOgl.addEventListener('click', (e) => {
    var oglasid = document.getElementById('oid').value;
    
    delOglas(oglasid);

});
userinf.addEventListener('click', (e) => {
    
    
    getUser();

});
updUser.addEventListener('click', (e) => {
    
    var novoUpo = document.getElementById('newusr').value;
    updateUser(novoUpo);

});



