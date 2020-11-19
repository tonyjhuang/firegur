import $ from 'jquery';
import firebase from 'firebase/app'
import '@firebase/auth'
import { firebaseApp } from '../firebase_config'
import { UserService } from '../services/user_service'


/**
 * Initializes the state of the signin toolbar using the current user auth state. 
 */
export function initToolbar(signinElement: HTMLElement, signoutElement: HTMLElement) {
    $(signoutElement).on('click', function (e) {
        firebaseApp.auth().signOut();
        updateLoginState(false, signinElement, signoutElement);
    });

    firebaseApp.auth().onAuthStateChanged(async user => {
        var userService = new UserService();
        if (user) {
            updateLoginState(true, signinElement, signoutElement);
            // if user id not in database, create user
            userService.isUserRegistered(user.uid).then(async isRegistered => {
                if (!isRegistered) {
                    var username = setDisplayName(user);
                    await userService.newUser(
                        user.uid,
                        { username: username });
                }
            });
        } else {
            updateLoginState(false, signinElement, signoutElement);
        }
    });
}

/**
 * Update log in state.
 */
function updateLoginState(bool: boolean, signinElement: HTMLElement, signoutElement: HTMLElement) {
    if (bool) {
        signinElement.style.visibility = 'hidden';
        signoutElement.style.visibility = 'visible';
    } else {
        signinElement.style.visibility = 'visible';
        signoutElement.style.visibility = 'hidden';
    }
}


function setDisplayName(user: firebase.User) {
    if (user.displayName) {
        return user.displayName;
    } else if (user.email) {
        return user.email;
    } else {
        return "";
    }
}