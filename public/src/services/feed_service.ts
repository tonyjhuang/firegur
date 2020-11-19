import firebase from 'firebase'
import { firebaseApp } from '../firebase_config';
import { PostService } from './post_service';
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
                // hideSpinner();
                $('#feed-container').append(await new PostService().renderPost(post, postId, true));
            } catch (e) {
                alert((e as Error).message);
            }
        }
    });
}

function hideSpinner() {
    $('#spinner').remove();
}