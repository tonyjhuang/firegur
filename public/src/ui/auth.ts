import $ from 'jquery';
import { firebaseApp } from '../firebase_config'
import { UserService } from '../services/user_service'

const SIGNIN_ELEMENT = `<a class="btn btn-sm btn-link" href="./signin.html" id="signin" >Sign In</a>`;
const SIGNOUT_ELEMENT = `<a class="btn btn-sm btn-link" id="signout">Sign Out</a><span class="align-middle" style="font-size: small">\${username}</span>`;

interface LoginState {
    isLoggedIn: boolean,
    username?: string
}

const loginState: LoginState = {
    isLoggedIn: false,
    username: undefined
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
        let tmpl = SIGNOUT_ELEMENT.slice();
        tmpl = tmpl.replace('${username}', loginState.username!);
        $(_container).append(tmpl);
        $('#signout').on('click', function (e) {
            firebaseApp.auth().signOut();
            loginState.isLoggedIn = false;
            updateViewState();
        });
    } else {
        $(_container).append(SIGNIN_ELEMENT);
    }
}
