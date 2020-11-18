import $ from 'jquery';
import postTemplateString from './templates/post.html'
import { PostService } from '../services/post_service'


/** On DOM ready. */
$(async function () {
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
    $('#post-container').append(renderPost());
}

function renderPost(): string {
    return postTemplateString;
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
