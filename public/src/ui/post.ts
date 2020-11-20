import $ from 'jquery';
import { Post, PostService } from '../services/post_service'
import { PostRenderer } from '../renderers/post_renderer'
import { initToolbar } from './auth'
import confetti from 'canvas-confetti'
import { firebaseApp } from '../firebase_config'

/**
 * If the post was created within the time threshold, celebrate!
 */
const CELEBRATION_THRESHOLD_SECONDS = 5;

interface PostState {
    loaded: boolean,
    isPublic: boolean
};

const postState: PostState = {
    loaded: false,
    isPublic: true
};

/** On DOM ready. */
$(async function () {
    const postId = getPostIdFromSearchParams();
    if (!postId) {
        goTo404Error();
        return;
    }
    try {
        await Promise.all([
            initToolbar($('#auth-container')[0]),
            loadPost(postId)]);
    } catch (e) {
        alert((e as Error).message);
    }
    hideSpinner();

    // Handle signouts
    firebaseApp.auth().onAuthStateChanged((user) => {
        if (!user) {
            // User is signed out
            if (postState.loaded && !postState.isPublic) {
                // Kick user back to index if not a public post.
                goToIndex();
            }
        }
    });
});

function getPostIdFromSearchParams(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('pid');
}

/**
 * Fetches and renders the requested post.
 */
async function loadPost(postId: string) {
    const postService = new PostService();
    const post = await postService.get(postId);
    postState.loaded = true;
    postState.isPublic = post.audience === 'public';
    hideSpinner();
    $('#post-container').append(await new PostRenderer().renderPost(post, /* isFeedPost= */ false));
    await celebratePost(post);
}

/**
 * Party time!
 */
async function celebratePost(post: Post) {
    const now = new Date();
    const timeElapsedSinceUploadInSeconds = (now.getTime() - post.timestamp.getTime()) / 1000;
    if (timeElapsedSinceUploadInSeconds <= CELEBRATION_THRESHOLD_SECONDS) {
        confetti({
            particleCount: 150,
            spread: 180
        });
    }
}

function hideSpinner() {
    $('#spinner').remove();
}

/**
 * Return to index.
 */
function goTo404Error() {
    window.location.href = './404.html';
}

/**
 * Return to index.
 */
function goToIndex() {
    window.location.href = './index.html';
}