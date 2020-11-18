import firebase from 'firebase'

export const BUCKET = "firegur-app.appspot.com";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyADkx0R20kiGU7upgsdFGn1PORCYs_Sps8",
    authDomain: "firegur-app.firebaseapp.com",
    projectId: "firegur-app",
    storageBucket: BUCKET,
    messagingSenderId: "276908818311",
    appId: "1:276908818311:web:a9d98565066ab458fe1d22",
    measurementId: "G-2BB8V06QH4"
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);