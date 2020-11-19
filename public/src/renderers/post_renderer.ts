import { firebaseApp } from '../firebase_config'
import postTemplateString from '../ui/templates/post.html'
import { Post } from '../services/post_service'
import $ from 'jquery';

export class PostRenderer {
    async renderPost(post: Post, pid: string, feedPost: boolean): Promise<string> {
        // Deep copy string.
        let tmpl = postTemplateString.slice();
        if (feedPost) {
            const titlePostElement = $('#title-post') 
            $('#post-title').attr("href", "post.html?pid=" + pid);
        }

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