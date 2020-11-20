import { Post, PostService } from './post_service'
import { PostRenderer } from '../renderers/post_renderer';
import { UserService } from './user_service'
import $ from 'jquery';

export class FeedService {
    /**
     * Fetches and renders a user's unified feed.
     */
    async renderFeed() {
        const eligibleAudiences = await generateAudienceArray();
        const feed = await new PostService().getAllForAudiences(eligibleAudiences);
        renderPosts(feed);
    }
}

/**
 * Renders all the posts and displays them as a feed.
 */
async function renderPosts(posts: Array<Post>) {
    const renderer = new PostRenderer();
    const renderedPostTasks = posts.map(post => renderer.renderPost(post, /* isFeedPost= */ true));
    (await Promise.all(renderedPostTasks)).forEach(renderedPost => $('#feed-container').append(renderedPost));
    hideSpinner();
}

/**
 * Gets the array of all audiences the user belongs to.
 */
async function generateAudienceArray() {
    const userService = new UserService();
    try {
        const user = await userService.getCurrentUser();
        return ["public", user.id].concat(user.groups);
    } catch (e) {
        // Not currently logged in, only show public posts.
        return ["public"];
    }
}

function hideSpinner() {
    $('#spinner').remove();
}