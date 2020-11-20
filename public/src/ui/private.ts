import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import { initToolbar } from './auth'
import { initGroups } from './groups'
import { FeedService } from '../services/feed_service'

$(async function () {
    await initToolbar($('#auth-container')[0]);
    var feedService = new FeedService();
    const userId = getUserIdFromSearchParams();
    if (!userId) {
        goTo404Error();
        return;
    }
    await feedService.loadPrivatePosts(userId);
    await initGroups($('#groups-container')[0]);
    hideSpinner();
});

function getUserIdFromSearchParams(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('uid');
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