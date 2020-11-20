import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import { initToolbar } from './auth'
import { initGroups } from './groups'
import { FeedService } from '../services/feed_service'
import spinnerString from '../ui/templates/spinner.html'
import { firebaseApp } from '../firebase_config'


$(async function () {
    showSpinner();

    // React to auth state changes.
    firebaseApp.auth().onAuthStateChanged(async () => {
       await render(); 
    });
});

async function render() {
    showSpinner();
    await initToolbar($('#auth-container')[0]);
    await initGroups($('#groups-container')[0], async () => await renderFeed());
    await renderFeed();
    hideSpinner();
}

async function renderFeed() {
    var feedService = new FeedService();
    await feedService.renderFeed($('#feed-container')[0]);
}


function hideSpinner() {
    $('#spinner').remove();
}

function showSpinner() {
    const container = $('#spinner-container')[0];
    container.innerHTML = '';
    $(container).append($(spinnerString));
}