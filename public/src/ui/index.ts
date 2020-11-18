import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import firebase from 'firebase'
import { firebaseApp } from '../firebase_config'
import { UserService } from '../services/user_service'

const signinElement = $('#signin')[0] as HTMLLinkElement
const signoutElement = $('#signout')[0] as HTMLLinkElement

$("#signout").on('click', function(e) {
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
        });
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

function setDisplayName(user: firebase.User) {
    if (user.displayName) {
        return user.displayName;
    } else if (user.email) {
        return user.email;
    } else {
        return "";
    }
}