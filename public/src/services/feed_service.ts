import firebase from 'firebase'
import { firebaseApp } from '../firebase_config';
import { PostService } from './post_service'
import { PostRenderer } from '../renderers/post_renderer';
import { UserService } from './user_service'
import $ from 'jquery';

var db = firebaseApp.firestore();

export class FeedService {
    /**
     * Loads all posts available to the user.
     */
    async loadAllPosts() {
        const publicPosts = await getAllPosts();
        renderPosts(publicPosts);
    }
}

/**
 * Queries Cloud Firestore for all posts available to the user.
 */
async function getAllPosts() {
    var postsRef = db.collection("posts");
    var eligibleAudiences = await generateAudienceArray();
    console.log("eligibleAudiences");
    var query = postsRef.where("audience", "in", eligibleAudiences).orderBy("uploadedAt", "desc");

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
                hideSpinner();
                $('#feed-container').append(await new PostRenderer().renderPost(post, postId, /* isFeedPost= */ true));
            } catch (e) {
                alert((e as Error).message);
            }
        }
    });
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
        return ["public"];
    }
}

function hideSpinner() {
    $('#spinner').remove();
}