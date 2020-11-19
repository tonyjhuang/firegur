import { firebaseApp } from '../firebase_config'
import postTemplateString from '../ui/templates/post.html'
import { Post } from '../services/post_service'

export class PostRenderer {
    async renderPost(post: Post, pid: string, isFeedPost: boolean): Promise<string> {
        // Deep copy string.
        let tmpl = postTemplateString.slice();
        if (isFeedPost) {
            const hrefLink = "href=\"./post.html?pid=" + pid + "\"";
            var linkedTitle = "<a " + hrefLink + ">" + post.title + "</a>";
            tmpl = tmpl.replace('${title}', linkedTitle);

        } else {
            tmpl = tmpl.replace('${title}', post.title);
        }

        tmpl = tmpl.replace('${audience}', post.audience);
        tmpl = tmpl.replace('${title}', post.title);

        if (post.caption) {
            tmpl = tmpl.replace('${caption}', post.caption);
        } else {
            tmpl = tmpl.replace('${caption}', "");
        }

        tmpl = tmpl.replace('${username}', post.author.username);
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