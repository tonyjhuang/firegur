import { v4 as uuidv4 } from 'uuid'
import { firebaseApp } from '../firebase_config'
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import { User, UserService } from './user_service'

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

export interface PostAuthor {
    username: string,
    id: string
}

export interface Post {
    id: string,
    title: string,
    caption?: string,
    author: PostAuthor
    url: string
    timestamp: Date
    audience: string
}

export class PostService {

    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * Uploads an image and creates a new Post for it. Returns the new post's id.
     */
    async create(
        options: CreatePostOptions,
        imageUploadProgressCallback: (progress: number) => any): Promise<string> {
        const id = uuidv4();
        const path = `posts/${id}`;
        const currentUser = await this.userService.getCurrentUser();
        await validateCreatePostOptions(options);
        await uploadImage(path, options.image, imageUploadProgressCallback);
        const newPost = await savePost(currentUser, path, options);
        return newPost.id;
    }

    /**
     * Returns a single stored Post.
     */
    async get(postId: string): Promise<Post> {
        const firestore = firebaseApp.firestore();
        const postDoc = await firestore.collection('posts').doc(postId).get();
        if (!postDoc.exists) {
            return Promise.reject(new Error('Post not found.'))
        }
        return docToPost(postId, postDoc.data()!, this.userService);
    }

    /**
     * Returns all posts that are valid for a given set of audiences.
     */
    async getAllForAudiences(audiences: Array<string>): Promise<Array<Post>> {
        if (!audiences) return Promise.resolve([]);
        const firestore = firebaseApp.firestore();
        var docs = await firestore.collection("posts")
            .where("audience", "in", audiences)
            .orderBy("uploadedAt", "desc")
            .get();

        if (docs.empty) return Promise.resolve([]);
        const tasks = docs.docs.map((doc: firebase.firestore.QueryDocumentSnapshot) => {
            return docToPost(doc.id, doc.data(), this.userService);
        });
        return Promise.all(tasks);
    }

    /**
     * Returns all posts that are valid for a given set of audiences.
     */
    async getPrivateForUser(userId: string): Promise<Array<Post>> {
        if (userId.length == 0) return Promise.resolve([]);
        const firestore = firebaseApp.firestore();
        var docs = await firestore.collection("posts")
            .where("authorId", "==", userId)
            .where("audience", "==", userId)
            .orderBy("uploadedAt", "desc")
            .get();

        if (docs.empty) return Promise.resolve([]);
        const tasks = docs.docs.map((doc: firebase.firestore.QueryDocumentSnapshot) => {
            return docToPost(doc.id, doc.data(), this.userService);
        });
        return Promise.all(tasks);    }
}

/**
 * Converts a Post Firestore document into a native Post object.
 */
async function docToPost(
    postId: string,
    postDoc: firebase.firestore.DocumentData,
    userService: UserService): Promise<Post> {
    const { username, id } = await userService.getUser(postDoc.authorId);
    return {
        id: postId,
        title: postDoc.title,
        caption: postDoc.caption,
        timestamp: postDoc.uploadedAt.toDate(),
        url: postDoc.path,
        author: {
            username,
            id
        },
        audience: postDoc.audience
    };
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
            firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot: firebase.storage.UploadTaskSnapshot) {
                imageUploadProgressCallback(snapshot.bytesTransferred / snapshot.totalBytes);
            }, function (error: firebase.storage.FirebaseStorageError) {
                return reject(new Error(error.code));
            }, resolve);
    });
}

/**
 * Saves a new Post document in Firestore.
 */
function savePost(user: User, path: string, options: CreatePostOptions): Promise<firebase.firestore.DocumentReference> {
    const firestore = firebaseApp.firestore();

    const data: any = {
        path: path,
        title: options.title,
        audience: privacyToAudience(options.privacy, user, options.groupId),
        uploadedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        authorId: user.id,
        seen: false
    };
    if (options.caption) data.caption = options.caption;

    return firestore.collection('posts').add(data);
}

function privacyToAudience(privacy: PostPrivacy, user: User, groupId?: string): string {
    switch (privacy) {
        case PostPrivacy.Public:
            return 'public';
        case PostPrivacy.Group:
            return groupId!;
        case PostPrivacy.Private:
            return user.id;
        default:
            throw new Error('Unsupported privacy type: ' + privacy);
    }
}