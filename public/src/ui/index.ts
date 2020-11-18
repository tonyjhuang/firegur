import '@firebase/analytics'
import '@firebase/auth'
import firebase from 'firebase'
import { firebaseApp } from '../firebase_config'
import { UserService } from '../services/user_service'


var currentUid: string | null = null;
firebaseApp.auth().onAuthStateChanged(function(user: firebase.User | null) {
    var userService = new UserService();
    if (user && user.uid != currentUid) {
        // TODO: Hide sign-in button and show sign-out button
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
        // TODO: Sign out operation. Reset current user UID.
        currentUid = null;
        // TODO: Hide sign-out button and show sign-in button in index.html
    }

});