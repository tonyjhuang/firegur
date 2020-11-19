import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import { initToolbar } from './auth'
import { initGroups } from './groups'
import { FeedService } from '../services/feed_service'

$(async function () {
    await initToolbar($('#auth-container')[0]);
    var feedService = new FeedService();
    await feedService.loadAllPosts();
    await initGroups($('#groups-container')[0]);
});
