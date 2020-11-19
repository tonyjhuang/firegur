import $ from 'jquery';
import 'firebase/storage'
import { PostService } from '../services/post_service'
import { PostRenderer } from '../renderers/post_renderer'
import { initToolbar } from './auth'



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
    const post = await new PostService().get(postId);
    console.log(JSON.stringify(post));
    hideSpinner();
    $('#post-container').append(await new PostRenderer().renderPost(post, postId, /* isFeedPost= */ false));
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
