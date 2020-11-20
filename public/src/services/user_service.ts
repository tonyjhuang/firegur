import { firebaseApp } from '../firebase_config'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

export interface CreateUserOptions {
    username: string
}

export interface User {
    username: string,
    id: string,
    groups: Array<string>
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
            id: userId,
            groups: []
        };
    }

    /**
     * Adds a new group to a user.
     */
    async addUserGroup(userId: string, group: string): Promise<void> {
        const firestore = firebaseApp.firestore();
        return firestore.doc(`users/${userId}`).update({
            groups: firebase.firestore.FieldValue.arrayUnion(group)
        });
    }

    /**
     * Removes a group from a user.
     */
    async removeUserGroup(userId: string, group: string): Promise<void> {
        const firestore = firebaseApp.firestore();
        return firestore.doc(`users/${userId}`).update({
            groups: firebase.firestore.FieldValue.arrayRemove(group)
        });
    }

    /**
     * Returns the currently logged in user. Registers the user if they are not already.
     */
    async getCurrentUser(): Promise<User> {
        const user = await fetchCurrentUser();
        try {
            return await this.getUser(user.uid);
        } catch (e) {
            return this.newUser(user.uid, { username: getDisplayName(user) });
        }
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
            id: docRef.id,
            groups: docRef.data()!.groups || []
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