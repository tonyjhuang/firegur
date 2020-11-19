import { firebaseApp } from '../firebase_config'
import postTemplateString from '../ui/templates/post.html'
import { Post } from '../services/post_service'
import { UserService } from '../services/user_service'

export class PostRenderer {
    async renderPost(post: Post, pid: string, isFeedPost: boolean): Promise<string> {
        // Deep copy string.
        let tmpl = postTemplateString.slice();
        if (isFeedPost) {
            const hrefLink = `href="./post.html?pid=${pid}"`;
            var linkedTitle = `<a ${hrefLink} class="link-unstyled" >${post.title}</a>`;
            tmpl = tmpl.replace('${title}', linkedTitle);

        } else {
            tmpl = tmpl.replace('${title}', post.title);
        }

        var audienceName = await getAudienceName(post.audience);
        tmpl = tmpl.replace('${audience}', audienceName);
        tmpl = tmpl.replace('${title}', post.title);

        if (post.caption) {
            tmpl = tmpl.replace('${caption}', post.caption);
        } else {
            tmpl = tmpl.replace('${caption}', "");
        }

        tmpl = tmpl.replace('${username}', post.author.username || 'Anonymous');
        tmpl = tmpl.replace('${timestamp}', post.timestamp.toDateString());

        const imageSrc: string = await getImageSrc(post);
        tmpl = tmpl.replace('${imageSrc}', imageSrc);
        return tmpl;
    }
}

function getImageSrc(post: Post): Promise<string> {
    const imageRef = firebaseApp.storage().ref(post.url);
    return imageRef.getDownloadURL();
}

// TODO: Adjust for better rendering of the audience (could run into errors if a groupId and userId are shared)
async function getAudienceName(audience: string) {
    var currentUser = await new UserService().getCurrentUser();
    if (audience == "public") {
        return "Public";
    } else if (audience == currentUser.id) {
        return "Private";
    } else {
        return "Group";
    }
}