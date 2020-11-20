import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import { initToolbar } from './auth'
import { FeedService } from '../services/feed_service'
import { firebaseApp } from '../firebase_config'

$(async function () {
    await initToolbar($('#auth-container')[0]);
    var feedService = new FeedService();
    const userId = getUserIdFromSearchParams();
    if (!userId) {
        goTo404Error();
        return;
    }
    try {
        await feedService.renderPrivateFeed(userId, $('#feed-container')[0]);
    } catch (e) {
        alert(e);
        console.error(e.message);
    }
    hideSpinner();


    // Handle signouts
    firebaseApp.auth().onAuthStateChanged((user) => {
        if (!user) {
            goToIndex();
        }
    });
});

function getUserIdFromSearchParams(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('uid');
}

function hideSpinner() {
    $('#spinner').remove();
}

/**
 * Show 404.
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