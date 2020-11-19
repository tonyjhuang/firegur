import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import { initToolbar } from './auth'

$(async function () {
    await initToolbar($('#auth-container')[0]);
});