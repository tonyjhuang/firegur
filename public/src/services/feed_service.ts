import { Post, PostService } from './post_service'
import { PostRenderer } from '../renderers/post_renderer';
import { UserService } from './user_service'
import $ from 'jquery';

export class FeedService {
    /**
     * Fetches and renders a user's unified feed.
     */
    async renderFeed(container: HTMLElement) {
        container.innerHTML = '';
        const eligibleAudiences = await generateAudienceArray();
        const feed = await new PostService().getAllForAudiences(eligibleAudiences);
        renderPosts(feed, container);
    }

    /**
     *  Load user's private posts.
     */
    async renderPrivateFeed(userId: string, container: HTMLElement) {
        const privatePosts = await new PostService().getPrivateForUser(userId);
        renderPosts(privatePosts, container);
    }

    /**
     *  Load group feed that user belongs to.
     */
    async renderGroupFeed(groupId: string, container: HTMLElement) {
        const userService = new UserService();

        try {
            const user = await userService.getCurrentUser();
            const groupPosts = await new PostService().getGroupForUser(user, groupId);
            renderPosts(groupPosts, container);
        } catch (e) {
            return Promise.reject(new Error('User is not logged in, unable to load group feed.'));
        }
    }
}

/**
 * Renders all the posts and displays them as a feed.
 */
async function renderPosts(posts: Array<Post>, container: HTMLElement) {
    const renderer = new PostRenderer();
    const renderedPostTasks = posts.map(post => renderer.renderPost(post, /* isFeedPost= */ true));
    (await Promise.all(renderedPostTasks)).forEach(renderedPost => $(container).append(renderedPost));
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
