import { v4 as uuidv4 } from 'uuid'
import { firebaseApp } from './firebase_config'
import firebase from 'firebase'
import { UserService } from './user_service'


export enum PostPrivacy {
    Private = 1,
    Public,
    Group
}

export interface CreatePostOptions {
    title: string,
    caption?: string,
    image: File,
    privacy: PostPrivacy,
    groupId?: string
}

export class PostService {
    /**
     * Uploads an image and creates a new Post for it.
     */
    async newPost(
        options: CreatePostOptions,
        imageUploadProgressCallback: (progress: number) => any): Promise<void> {
        const id = uuidv4();
        const path = `posts/${id}`;
        const currentUser = await new UserService().getCurrentUser();
        await validateCreatePostOptions(options);
        await uploadImage(path, options.image, imageUploadProgressCallback);
        await savePost(currentUser, path, options);
    }

}

/**
 * Validates options and returns undefined or an error string.
 */
function validateCreatePostOptions(options: CreatePostOptions): Promise<void> {
    if (options.privacy === PostPrivacy.Group) {
        const groupId = options.groupId;
        if (!groupId) {
            return Promise.reject(new Error('Missing group name.'));
        } else if (/\s/g.test(groupId)) {
            return Promise.reject(new Error('Invalid group name.'));
        }
    }
    return Promise.resolve();
}

/**
 * Uploads an image to Firebase Storage.
 */
function uploadImage(
    path: string, 
    image: File, 
    imageUploadProgressCallback: (progress: number) => any): Promise<void> {
    const storage = firebaseApp.storage();
    const imageUploadTask = storage.ref(path).put(image);
    // Wrap image upload in promise.
    return new Promise((resolve, reject) => {
        imageUploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                imageUploadProgressCallback(snapshot.bytesTransferred / snapshot.totalBytes);
            }, function (error) {
                return reject(new Error(error.code));
            }, resolve);
    });
}

/**
 * Saves a new Post document in Firestore.
 */
function savePost(user: firebase.User, path: string, options: CreatePostOptions): Promise<firebase.firestore.DocumentReference> {
    const firestore = firebaseApp.firestore();
    const data: any = {
        path: path,
        title: options.title,
        uploadedAt: firebase.firestore.Timestamp.fromDate(new Date())
    };
    if (options.caption) data.caption = options.caption;

    const collectionPath = getCollectionPath(user, options);
    return firestore.collection(collectionPath).add(data);
}

function getCollectionPath(user: firebase.User, options: CreatePostOptions): string {
    switch (options.privacy) {
        case PostPrivacy.Public:
            return 'posts/public/posts';
        case PostPrivacy.Private:
            return `posts/${user.uid}/posts`;
        case PostPrivacy.Group:
            return `posts/${options.groupId!}/posts`;
    }
}