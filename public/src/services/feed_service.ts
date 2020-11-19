import firebase from 'firebase'
import { firebaseApp } from '../firebase_config';
import { PostService } from './post_service'
import { PostRenderer } from '../renderers/post_renderer';
import $ from 'jquery';

var db = firebaseApp.firestore();

export class FeedService {
    // Get all public posts
    async loadPublicPosts() {
        const publicPosts = await getPublicPosts();
        renderPosts(publicPosts);
    }
}

async function getPublicPosts() {
    // Query Cloud Firestore for any posts with audience = "public"
    var postsRef = db.collection("posts");
    var query = postsRef.where("audience", "==", "public").orderBy("uploadedAt", "desc");

    return query.get();
}

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

function hideSpinner() {
    $('#spinner').remove();
}