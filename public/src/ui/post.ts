import $ from 'jquery';
import { firebaseApp } from '../firebase_config'
import firebase from 'firebase/app'
import 'firebase/storage'
import postTemplateString from './templates/post.html'
import { Post, PostService } from '../services/post_service'
import { initToolbar } from './auth'



/** On DOM ready. */
$(async function () {
    initToolbar($('#signin')[0], $('#signout')[0]);
    const postId = getPostIdFromSearchParams();
    if (!postId) {
        goTo404Error();
        return;
    }
    try {
        await loadPost(postId);
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
    $('#post-container').append(await new PostService().renderPost(post, postId, false));
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
