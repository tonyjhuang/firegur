export {};

import firebase from "firebase/app";
import "firebase/auth"
import * as firebaseui from "firebaseui";
import $ from 'jquery';
import { firebaseApp } from './firebase_config'

var ui = new firebaseui.auth.AuthUI(firebaseApp.auth());

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