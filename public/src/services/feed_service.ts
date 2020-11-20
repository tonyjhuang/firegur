import firebase from 'firebase'
import { firebaseApp } from '../firebase_config';
import { PostService } from './post_service'
import { PostRenderer } from '../renderers/post_renderer';
import { UserService } from './user_service'
import $ from 'jquery';

const db = firebaseApp.firestore();

export class FeedService {
    /**
     * Loads all posts available to the user.
     */
    async loadAllPosts() {
        const publicPosts = await getAllPosts();
        renderPosts(publicPosts);
    }

    /**
     *  Load user's private posts.
     */
    async loadPrivatePosts(userId: string) {
        const privatePosts = await getPrivatePosts(userId);
        renderPosts(privatePosts);
    }
}

/**
 * Queries Cloud Firestore for all posts available to the user.
 */
async function getAllPosts() {
    var postsRef = db.collection("posts");
    var eligibleAudiences = await generateAudienceArray();
    var query = postsRef.where("audience", "in", eligibleAudiences).orderBy("uploadedAt", "desc");

    return query.get();
}

/**
 * Queries Cloud Firestore for all posts available to the user.
 */
async function getPrivatePosts(userId: string) {
    var postsRef = db.collection("posts");
    var query = postsRef.where("authorId", "==", userId).where("audience", "==", userId).orderBy("uploadedAt", "desc");

    return query.get();
}

/**
 * Renders all the posts and displays them as a feed.
 */
async function renderPosts(postsSnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) {
    postsSnapshot.forEach(async function(doc: any) {
        var postId = doc.id;
        if (!postId) {
            // continue to next postId
        } else {
            try {
                const post = await new PostService().get(postId);
                console.log(JSON.stringify(post));
                $('#feed-container').append(await new PostRenderer().renderPost(post, postId, /* isFeedPost= */ true));
            } catch (e) {
                alert((e as Error).message);
            }
        }
    });
    hideSpinner();
}

/**
 * Gets the array of all audiences the user belongs to.
 */
async function generateAudienceArray() {
    const userService = new UserService();
    try {
        const user = await userService.getCurrentUser();
        return ["public", user.id].concat(user.groups);
    } catch (e) {
        // Not currently logged in, only show public posts.
        return ["public"];
    }
}

function hideSpinner() {
    $('#spinner').remove();
}