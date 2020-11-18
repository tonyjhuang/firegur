import { v4 as uuidv4 } from 'uuid'
import { firebaseApp } from './firebase_config'
import firebase from 'firebase'
import "firebase/auth"

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
    isUserRegistered(id: string) : boolean {
        const firestore = firebase.firestore();
        var docRef = firestore.collection('users').doc(id);
        docRef.get().then(function(doc) {
            if(doc.exists) {
                return true;
            }
            return false;
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        return false;
    }

    // TODO: Implement adding group to user.
    addGroupToUser(userId: string, groupIds: String[]) {
        // Check for user
        // Add groupIds to user's array
    }

}

/**
 * Creates a new User document in Firestore.
 */
function createUser(userId: string, options: CreateUserOptions) {
    const firestore = firebase.firestore();
    const data: any = {
        username: options.username,
    };
    return firestore.collection('users').doc(userId).set(data);
}