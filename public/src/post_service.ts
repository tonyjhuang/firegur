import { v4 as uuidv4 } from 'uuid'
import { firebaseApp } from './firebase_config'
import firebase from 'firebase'


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

/**
 * Callback handler for create a new post.
 */
export interface NewPostCallback {
    // progress = [0, 1]
    onImageUploadProgress(progress: number): void
    onComplete(): void
    onError(e: Error): void
}

export class PostService {
    /**
     * Uploads an image and creates a new Post for it.
     */
    newPost(options: CreatePostOptions, callback: NewPostCallback) {
        const id = uuidv4();
        const path = `posts/${id}`;

        const validateErrorMsg = validateCreatePostOptions(options);
        if (validateErrorMsg) {
            callback.onError(new Error(validateErrorMsg));
            return;
        }

        uploadImage(path, options.image).on(
            firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                callback.onImageUploadProgress(snapshot.bytesTransferred / snapshot.totalBytes)
            }, function (error) {
                callback.onError(new Error(error.code));
            }, function () {
                // Upload completed successfully.
                createPost(path, options)
                    .then(callback.onComplete)
                    .catch(callback.onError);
            });

    }
}

/**
 * Validates options and returns undefined or an error string.
 */
function validateCreatePostOptions(options: CreatePostOptions): string | undefined {
    if (options.privacy === PostPrivacy.Group) {
        const groupId = options.groupId;
        if (!groupId) {
            return 'Missing group name.';
        } else if (/\s/g.test(groupId)) {
            return 'Invalid group name.';
        }
    } else if (options.privacy === PostPrivacy.Private) {
        return 'Unsupported.';
    }
}

/**
 * Uploads an image to Firebase Storage.
 */
function uploadImage(path: string, image: File): firebase.storage.UploadTask {
    const storage = firebaseApp.storage();
    return storage.ref(path).put(image);
}

/**
 * Creates a new Post document in Firestore.
 */
function createPost(path: string, options: CreatePostOptions): Promise<firebase.firestore.DocumentReference> {
    const firestore = firebase.firestore();
    const data: any = {
        path: path,
        title: options.title,
        uploadedAt: firebase.firestore.Timestamp.fromDate(new Date())
    };
    if (options.caption) data.caption = options.caption;

    const collectionPath = getCollectionPath(options);
    return firestore.collection(collectionPath).add(data);
}

function getCollectionPath(options: CreatePostOptions): string {
    switch (options.privacy) {
        case PostPrivacy.Public:
            return 'posts/public/posts';
        case PostPrivacy.Private:
            // TODO get userid from auth
            return '';
        case PostPrivacy.Group:
            return `posts/${options.groupId!}/posts`;
    }
}