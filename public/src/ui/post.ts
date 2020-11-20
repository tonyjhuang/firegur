import $ from 'jquery';
import { Post, PostService } from '../services/post_service'
import { PostRenderer } from '../renderers/post_renderer'
import { initToolbar } from './auth'
import confetti from 'canvas-confetti'

/**
 * If the post was created within the time threshold, celebrate!
 */
const CELEBRATION_THRESHOLD_SECONDS = 5;

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
    console.log(JSON.stringify(post));
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
