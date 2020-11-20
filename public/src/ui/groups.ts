import $ from 'jquery';
import { firebaseApp } from '../firebase_config'
import { User, UserService } from '../services/user_service'
import M from 'materialize-css'

interface GroupsState {
    isLoggedIn: boolean,
    userId?: string,
    groups: Array<string>
}

const groupsState: GroupsState = {
    isLoggedIn: false,
    userId: undefined,
    groups: []
};

let _groupsContainer: HTMLElement;
let _onGroupsChanged: (() => any) | undefined;

const CHIPS_CONTAINER_ELEMENT = `<div class="chips chips-initial" id='chips-container'></div>`;

/**
 * Entry point.
 */
export async function initGroups(groupsContainer: HTMLElement, onGroupsChanged?: () => any) {
    _groupsContainer = groupsContainer;
    _onGroupsChanged = onGroupsChanged;
    _groupsContainer.innerHTML = '';
    // React to auth state changes.
    firebaseApp.auth().onAuthStateChanged(() => {
        render();
    });
}

/**
 * Set state and load the UI.
 */
async function render() {
    const userService = new UserService();
    try {
        const currentUser = await userService.getCurrentUser();
        groupsState.isLoggedIn = true;
        groupsState.userId = currentUser.id;
        groupsState.groups = currentUser.groups;
    } catch (e) {
        // User not logged in.
        groupsState.isLoggedIn = false;
        groupsState.groups = [];
    }
    updateViewState();
}

/**
 * React to UI state.
 */
function updateViewState() {
    // Clear view state.
    _groupsContainer.innerHTML = '';
    if (!groupsState.isLoggedIn) return;

    $(_groupsContainer).append(CHIPS_CONTAINER_ELEMENT);
    const data = groupsState.groups.map(group => {
        return {
            tag: group
        }
    });
    M.Chips.init($('.chips-initial'), {
        data,
        placeholder: 'Join a group',
        secondaryPlaceholder: '+group',
        onChipAdd: onGroupAdded,
        onChipDelete: onGroupDeleted
    });
}

/**
 * Handle the user adding a new group.
 */
async function onGroupAdded(this: M.Chips, element: Element, chip: Element) {
    const group = getChipValue(chip);
    await new UserService().addUserGroup(groupsState.userId!, group);
    groupsState.groups.push(group);
    updateViewState();
    if (_onGroupsChanged) {
        _onGroupsChanged();
    }
}

/**
 * Handle the user adding a remove group.
 */
async function onGroupDeleted(this: M.Chips, element: Element, chip: Element) {
    const group = getChipValue(chip);
    await new UserService().removeUserGroup(groupsState.userId!, group);
    groupsState.groups = groupsState.groups.filter(g => g !== group);
    updateViewState();
    if (_onGroupsChanged) {
        _onGroupsChanged();
    }
}

function getChipValue(chip: Element): string {
    return (chip as HTMLDivElement).innerHTML.split('<')[0];
}