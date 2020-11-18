export { };

import '@firebase/analytics'
import '@firebase/auth'
import { firebaseApp } from './firebase_config'
import { UserService } from './user_service'


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
        let app = firebaseApp;;
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

var currentUid: string | null = null;
firebaseApp.auth().onAuthStateChanged(function(user) {
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