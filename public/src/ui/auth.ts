import $ from 'jquery';
import { firebaseApp } from '../firebase_config'
import { UserService } from '../services/user_service'

const SIGNIN_ELEMENT = `<a class="btn btn-sm btn-link" href="./signin.html" id="signin" >Sign In</a>`;
const SIGNOUT_ELEMENT = `<a class="btn btn-sm btn-link" id="signout">Sign Out</a><span class="align-middle" style="font-size: small"><a href=\"./private.html?uid=\${userId}\">\${username}</a></span>`;

interface LoginState {
    isLoggedIn: boolean,
    username?: string,
    uid?: string
}

const loginState: LoginState = {
    isLoggedIn: false,
    username: undefined,
    uid: undefined
};

let _container: HTMLElement;

/**
 * Initializes the state of the signin toolbar using the current user auth state. 
 */
export async function initToolbar(container: HTMLElement) {
    _container = container;
    try {
        const user = await new UserService().getCurrentUser();
        loginState.isLoggedIn = true;
        loginState.username = user.username || 'Anonymous';
        loginState.uid = user.id;
    } catch (e) {
        // User not logged in.
        // Intentionally left blank.
    } finally {
        updateViewState();
    }
}

function updateViewState() {
    // Clear container.
    _container.innerHTML = '';
    if (loginState.isLoggedIn) {
        // User is logged in.
        $(_container).append(renderSignout());
        // Attach signout click listener.
        $('#signout').on('click', function (e) {
            firebaseApp.auth().signOut();
            loginState.isLoggedIn = false;
            updateViewState();
        });
    } else {
        // User is not logged in.
        $(_container).append(SIGNIN_ELEMENT);
    }
}

function renderSignout(): string {
    let tmpl = SIGNOUT_ELEMENT.slice();
    tmpl = tmpl.replace('${username}', loginState.username!);
    tmpl = tmpl.replace('${userId}', loginState.uid!);
    return tmpl;
}