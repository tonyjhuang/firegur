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

/**
 * Set image preview when the user selects an image using the picker.
 */
$('#upload').on('change', function (e) {
    const input = e.currentTarget as HTMLInputElement
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const label = $('#upload-label')[0] as HTMLLabelElement;
    label.innerText = file.name;
    setImagePreview($('#imageResult')[0] as HTMLImageElement, file)
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

/**
 * Update form state with a new title.
 */
$('#title').on('input', function (e) {
    const input = e.currentTarget as HTMLInputElement;
    formState.title = input.value;
    updateViewState();
});

/**
 * Update form state with a new caption.
 */
$('#caption').on('input', function (e) {
    const input = e.currentTarget as HTMLInputElement;
    formState.caption = input.value;
    updateViewState();
});

/**
 * Enable/disable submit button.
 */
function updateViewState() {
    console.log(JSON.stringify(formState));
    const submit = $('#submit')[0] as HTMLButtonElement;
    if (formState.title && formState.image) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
}

/**
 * Handle post submit
 */
$('#submit').on('click', function (e) {
    if (!formState.title && !formState.image) return;
    new PostService().newPost({
        title: formState.title,
        caption: formState.caption,
        image: formState.image!
    }, {
        onImageUploadProgress(progress: number) {
            setProgressBarPercentage(progress);
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

/**
 * Styles the progress bar, takes a value within [0, 1]
 */
function setProgressBarPercentage(progress: number) {
    if (progress < 0 || progress > 1) {
        console.warn('unexpected progress value: ' + progress);
        return;
    }
    const progressBar = $('#post-progress')[0] as HTMLDivElement;
    progressBar.style.width = `${progress * 100}%`;
}

/**
 * Return to index.
 */
function goToIndex() {
    window.location.href = './index.html';
}