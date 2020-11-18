export { };

import '@firebase/analytics'
import '@firebase/auth'
import $ from 'jquery';
import { firebaseApp } from './firebase_config'
import { UserService } from './user_service'

const signinElement = $('#signin')[0] as HTMLLinkElement
const signoutElement = $('#signout')[0] as HTMLLinkElement

$("#signout").on('click', function(e) {
    firebaseApp.auth().signOut();
    updateLoginState(false, signinElement, signoutElement);
});

firebaseApp.auth().onAuthStateChanged(user => {
    var userService = new UserService();
    if (user) {
        updateLoginState(true, signinElement, signoutElement);
        // if user id not in database, create user
        if (!userService.isUserRegistered(user.uid)) {
            var username = "";
            if (user.displayName) {
                username = user.displayName;
            } else if (user.email) {
                username = user.email;
            }
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
        updateLoginState(false, signinElement, signoutElement);
    }
});

/**
 * Update log in state.
 */
function updateLoginState(bool: boolean, signinElement: HTMLLinkElement, signoutElement: HTMLLinkElement) {
    if (bool) {
        signinElement.style.visibility = 'hidden';
        signoutElement.style.visibility = 'visible';
    } else {
        signinElement.style.visibility = 'visible';
        signoutElement.style.visibility = 'hidden';
    }
}