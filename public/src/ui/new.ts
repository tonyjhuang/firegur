import $ from 'jquery';
import { PostService, PostPrivacy } from '../services/post_service'

interface FormState {
    title: string,
    caption: string,
    image?: File
    privacy: PostPrivacy,
    groupId?: string
}

var formState: FormState = {
    title: '',
    caption: '',
    image: undefined,
    privacy: PostPrivacy.Public,
    groupId: ''
};

const BUTTON_ID_TO_PRIVACY: Record<string, PostPrivacy> = {
    'privacy-private': PostPrivacy.Private,
    'privacy-public': PostPrivacy.Public,
    'privacy-group': PostPrivacy.Group
}

/** On DOM ready. */
$(function () {
    updateViewState();
});

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
    formState['title'] = input.value;
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
 * Update form state with a new groupId.
 */
$('#groupId').on('input', function (e) {
    const input = e.currentTarget as HTMLInputElement;
    formState.groupId = input.value;
    updateViewState();
});

/**
 * React to changes in form data.
 */
function updateViewState() {
    console.log(JSON.stringify(formState));
    const submit = $('#submit')[0] as HTMLButtonElement;
    // Enable/disable submit button
    if (formState.title && formState.image) {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
    // Set privacy butotn state
    for (const [buttonId, privacy] of Object.entries(BUTTON_ID_TO_PRIVACY)) {
        const button = $(`#${buttonId}`)[0];
        if (formState.privacy === privacy) {
            button.classList.remove('btn-secondary');
            button.classList.add('btn-primary');
        } else {
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        }
    }
    // Show/hide group id input
    const groupIdInput = $('#groupId')[0];
    if (formState.privacy === PostPrivacy.Group) {
        groupIdInput.style.visibility = 'visible';
    } else {
        groupIdInput.style.visibility = 'hidden';
    }
}

/**
 * Handle post submit
 */
$('#submit').on('click', async function (e) {
    if (!formState.title && !formState.image) return;
    await new PostService().create({
        title: formState.title,
        caption: formState.caption,
        image: formState.image!,
        privacy: formState.privacy,
        groupId: formState.groupId
    }, setProgressBarPercentage)
        .then((postId) => {
            console.log('done!')
            goToPost(postId);
        }).catch((e: Error) => {
            alert(e.message);
            console.warn(e);
        });
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
function goToPost(postId: string) {
    window.location.href = `./post.html?pid=${postId}`;
}

$('.privacy-button').on('click', function (e) {
    const buttonId: string = e.currentTarget.id;
    formState.privacy = BUTTON_ID_TO_PRIVACY[buttonId];
    updateViewState();
})