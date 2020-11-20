import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import { initToolbar } from './auth'
import { FeedService } from '../services/feed_service'
import { firebaseApp } from '../firebase_config'

$(async function () {
    await initToolbar($('#auth-container')[0]);
    var feedService = new FeedService();
    const groupId = getGroupIdFromSearchParams();
    if (!groupId) {
        goTo404Error();
        return;
    }
    try {
        await feedService.renderGroupFeed(groupId, $('#feed-container')[0]);
    } catch (e) {
        alert(e.message);
        console.error(e);
    }
    hideSpinner();


    // Handle signouts
    firebaseApp.auth().onAuthStateChanged((user) => {
        if (!user) {
            goToIndex();
        }
    });
});

function getGroupIdFromSearchParams(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('groupid');
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