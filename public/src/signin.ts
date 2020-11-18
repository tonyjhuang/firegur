export {};

import firebase from "firebase/app";
import "firebase/auth"
import * as firebaseui from "firebaseui";
import $ from 'jquery';

var firebaseConfig = {
    apiKey: "AIzaSyADkx0R20kiGU7upgsdFGn1PORCYs_Sps8",
    authDomain: "firegur-app.firebaseapp.com",
    projectId: "firegur-app",
    storageBucket: "firegur-app.appspot.com",
    messagingSenderId: "276908818311",
    appId: "1:276908818311:web:a9d98565066ab458fe1d22",
    measurementId: "G-2BB8V06QH4"
};

firebase.initializeApp(firebaseConfig);

var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult:boolean, redirectUrl:string) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            const loaderElement = document.getElementById('loader');
            if (loaderElement) {
                loaderElement.style.display = 'none';
            }
        }

    },
    signInSuccessUrl: 'index.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ]
};

ui.start("#firebaseui-auth-container", uiConfig);