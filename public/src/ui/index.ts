import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import { initToolbar } from './auth'

$(async function () {
    initToolbar($('#signin')[0], $('#signout')[0]);
});