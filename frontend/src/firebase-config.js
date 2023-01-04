const config = {
    apiKey: "AIzaSyDe8074PwjBQGoMrGvl0UU-RVL0dRTlye0",
    authDomain: "exlibra-563bd.firebaseapp.com",
    projectId: "exlibra-563bd",
    storageBucket: "exlibra-563bd.appspot.com",
    messagingSenderId: "60246911702",
    appId: "1:60246911702:web:c6dfc71fbe0db8de1fb777"
  };
  
  export function getFirebaseConfig() {
    if (!config || !config.apiKey) {
      throw new Error('No Firebase configuration object provided.' + '\n' +
      'Add your web app\'s configuration object to firebase-config.js');
    } else {
      return config;
    }
  }