import $ from 'jquery';
import { firebaseApp } from '../firebase_config'
import 'firebase/storage'
import postTemplateString from './templates/post.html'
import { Post, PostService } from '../services/post_service'
import { PostRenderer } from '../renderers/post_renderer'
import { initToolbar } from './auth'
import confetti from 'canvas-confetti'



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

async function loadPost(postId: string) {
    const postService = new PostService();
    const post = await postService.get(postId);
    console.log(JSON.stringify(post));
    hideSpinner();
    $('#post-container').append(await new PostRenderer().renderPost(post, postId, /* isFeedPost= */ false));
    await celebratePost(post);
}

async function celebratePost(post: Post) {
    if (post.seen) return;
    confetti({
        particleCount: 150,
        spread: 180
    });
    await new PostService().markAsSeen(post.id);
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
