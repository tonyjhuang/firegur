export {};

import firebase from '@firebase/app'
import '@firebase/analytics'
import '@firebase/auth'


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyADkx0R20kiGU7upgsdFGn1PORCYs_Sps8",
    authDomain: "firegur-app.firebaseapp.com",
    projectId: "firegur-app",
    storageBucket: "firegur-app.appspot.com",
    messagingSenderId: "276908818311",
    appId: "1:276908818311:web:a9d98565066ab458fe1d22",
    measurementId: "G-2BB8V06QH4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


document.addEventListener('DOMContentLoaded', function () {
    const loadEl = document.querySelector('#load');
    if (!loadEl) return;
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
        let app = firebase.app();
        let features = [
            'auth',
            'database',
            'firestore',
            'functions',
            'messaging',
            'storage',
            'analytics',
            'remoteConfig',
            'performance',
        ].filter(feature => app.hasOwnProperty(feature))
        loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
        console.error(e);
        loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
    }
});

