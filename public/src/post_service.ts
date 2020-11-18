import { v4 as uuidv4 } from 'uuid'
import { firebaseApp } from './firebase_config'
import firebase from 'firebase'

export interface CreatePostOptions {
    title: string,
    caption?: string,
    image: File
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
        uploadImage(path, options.image).on(
            firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                callback.onImageUploadProgress(snapshot.bytesTransferred / snapshot.totalBytes)
            }, function (error) {
                callback.onError(new Error(error.code));
            }, function () {
                // Upload completed successfully.
                createPost(path, options)
                    .then(callback.onComplete)
                    .catch(callback.onError)
            });

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

    return firestore.collection('posts/public/posts').add(data);
}