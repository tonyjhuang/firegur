import { firebaseApp } from '../firebase_config'
import firebase from 'firebase/app'
import 'firebase/auth'

export interface CreateUserOptions {
    username: string,
    // groups: array string
}

/**
 * Callback handler for create a new post.
 */
export interface NewUserCallback {
    onComplete(): void
    onError(e: Error): void
}

export interface User {
    username: string,
    id: string
}

export class UserService {
    /**
     * Uploads an image and creates a new Post for it.
     */
    newUser(userId: string, options: CreateUserOptions, callback: NewUserCallback) {
        createUser(userId, options)
            .then(callback.onComplete)
            .catch(callback.onError);
    }

    /**
     * Checks if the user exists in Firestore.
     */
    isUserRegistered(id: string): boolean {
        const firestore = firebaseApp.firestore();
        var docRef = firestore.collection('users').doc(id);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                return true;
            }
            return false;
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        return false;
    }

    // TODO: Implement adding group to user.
    addGroupToUser(userId: string, groupIds: String[]) {
        // Check for user
        // Add groupIds to user's array
    }

    getCurrentUser(): Promise<User> {
        return fetchCurrentUser()
            .then((user: firebase.User) => this.getUser(user.uid));
    }

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

/**
 * Creates a new User document in Firestore.
 */
function createUser(userId: string, options: CreateUserOptions) {
    const firestore = firebaseApp.firestore();
    const data: any = {
        username: options.username,
    };
    return firestore.collection('users').doc(userId).set(data);
}