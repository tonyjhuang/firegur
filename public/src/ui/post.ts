import $ from 'jquery';
import { firebaseApp } from '../firebase_config'
import firebase from 'firebase/app'
import 'firebase/storage'
import postTemplateString from './templates/post.html'
import { Post, PostService } from '../services/post_service'
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
    $('#post-container').append(await renderPost(post));
}

async function renderPost(post: Post): Promise<string> {
    // Deep copy string.
    let tmpl = postTemplateString.slice();
    tmpl = tmpl.replace('${title}', post.title);
    if (post.caption) {
        tmpl = tmpl.replace('${caption}', post.caption);
    } else {
        $('#caption').remove();
    }
    tmpl = tmpl.replace('${username}', post.author.username);
    tmpl = tmpl.replace('${timestamp}', post.timestamp.toDateString());

    const imageSrc: string = await getImageSrc(post);
    tmpl = tmpl.replace('${imageSrc}', imageSrc);
    return tmpl;
}

function getImageSrc(post: Post): Promise<string> {
    const imageRef = firebaseApp.storage().ref(post.url);
    return imageRef.getDownloadURL();
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
