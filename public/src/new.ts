export { };

import $ from 'jquery';
import { PostService } from './post_service'

interface FormState {
    title: string,
    caption: string,
    image?: File
}

var formState: FormState = {
    title: '',
    caption: '',
    image: undefined
};

$('#upload').on('change', function (e) {
    const input = e.currentTarget as HTMLInputElement
    if (input.files && input.files[0]) {
        const label = $('#upload-label')[0] as HTMLLabelElement;
        const file = input.files[0];
        label.innerText = file.name;
        setImagePreview($('#imageResult')[0] as HTMLImageElement, file)
    }
});

function setImagePreview(preview: HTMLImageElement, file: File) {
    var reader = new FileReader();

    reader.onload = function (e) {
        const target = e.target;
        if (!target) return;
        const result = target.result;
        if (!result) return;
        preview.src = result as string
        formState.image = file
        updateViewState();
    };
    reader.readAsDataURL(file);
}
$('#title').on('input', function (e) {
    const input = e.currentTarget as HTMLInputElement;
    formState.title = input.value;
    updateViewState();
});

function updateViewState() {
    console.log(JSON.stringify(formState));
    const submit = $('#submit')[0] as HTMLButtonElement;
    if (formState.title && formState.image) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
}

$('#submit').on('click', function (e) {
    if (!formState.title && !formState.image) return;
    new PostService().newPost({
        title: formState.title,
        caption: formState.caption,
        image: formState.image!
    }, {
        onImageUploadProgress(progress: number) {
            // TODO: show progress in UI
            console.log(`Progress: ${progress}`);
        },
        onComplete() {
            // TODO: navigate to index.
            console.log('done!')
            goToIndex();
        },
        onError(e: Error) {
            // TODO: show error in UI
            console.warn(e);
        }
    })
});

function goToIndex() {
    window.location.href = './index.html';
}