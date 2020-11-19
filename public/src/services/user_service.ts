import { firebaseApp } from '../firebase_config'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export interface CreateUserOptions {
    username: string,
    // groups: array string
}

export interface User {
    username: string,
    id: string
}

export class UserService {
    /**
     * Creates and stores a new user.
     */
    async newUser(userId: string, options: CreateUserOptions): Promise<User> {
        const firestore = firebaseApp.firestore();
        const data: any = {
            username: options.username,
        };
        await firestore.collection('users').doc(userId).set(data);
        return {
            username: options.username,
            id: userId
        };
    }

    // TODO: Implement adding group to user.
    addGroupToUser(userId: string, groupIds: String[]) {
        // Get user's reference in Firestore
        // Add groupIds to user's array
    }

    /**
     * Returns the currently logged in user. Registers the user if they are not already.
     */
    getCurrentUser(): Promise<User> {
        return fetchCurrentUser()
            .then((user: firebase.User) => {
                return this.getUser(user.uid)
                    .catch(() => this.newUser(user.uid, { username: getDisplayName(user) }));
            });
    }

    /**
     * Returns a stored user from the database.
     */
    async getUser(userId: string): Promise<User> {
        const firestore = firebaseApp.firestore();
        const docRef = await firestore.doc(`users/${userId}`).get();
        if (!docRef.exists) {
            return Promise.reject(new Error('User not found.'));
        }
        return Promise.resolve({
            username: docRef.data()!.username,
            id: docRef.id
        });
    }
}

function fetchCurrentUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
        firebaseApp.auth().onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                return reject(new Error('Please login first.'));
            }
            return resolve(currentUser!);
        });
    });
}


function getDisplayName(user: firebase.User): string {
    if (user.displayName) {
        return user.displayName;
    } else if (user.email) {
        return user.email;
    } else {
        return "";
    }
}