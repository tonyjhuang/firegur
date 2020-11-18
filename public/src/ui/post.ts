import $ from 'jquery';
import postTemplateString from './templates/post.html'
import { Post, PostService } from '../services/post_service'


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
    $('#post-container').append(renderPost(post));
}

function renderPost(post: Post): string {
    // Deep copy string.
    console.log(postTemplateString);
    let tmpl = postTemplateString.slice();
    console.log(tmpl)
    tmpl = tmpl.replace('${title}', post.title);
    if (post.caption) tmpl = tmpl.replace('${caption}', post.caption);
    tmpl = tmpl.replace('${username}', post.author.username);
    tmpl = tmpl.replace('${timestamp}', post.timestamp.toDateString());
    console.log(tmpl);
    return tmpl;
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
