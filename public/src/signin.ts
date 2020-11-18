export {};

import firebase from "firebase/app";
import "firebase/auth"
import * as firebaseui from "firebaseui";
import $ from 'jquery';
import { firebaseApp } from './firebase_config'
import { UserService } from './user_service'


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

var currentUid: string | null = null;
firebase.auth().onAuthStateChanged(function(user) {
    var userService = new UserService();
    if (user && user.uid != currentUid) {
        // Hide sign-in button and show sign-out button
        // if user.uid exists in storage
        // else, createUser
        if (!userService.isUserRegistered(user.uid)) {
            var username = "";
            if (user.displayName) {
                username = user.displayName;
            } else if (user.displayName)
            userService.newUser(
                user.uid,
                {username: username},
                {
                    onComplete() {
                        console.log('Registered user!')
                    },
                    onError(e: Error) {
                        console.warn(e);
                    }

                });
        }
    } else { 
        // Sign out operation. Reset current user UID.
        currentUid = null;
        // Hide sign-out button and show sign-in button in index.html
    }

});