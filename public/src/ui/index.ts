import $ from 'jquery';
import '@firebase/analytics'
import '@firebase/auth'
import firebase from 'firebase/app'
import { firebaseApp } from '../firebase_config'
import { UserService } from '../services/user_service'
import { initToolbar } from './auth'

$(function () {
    initToolbar($('#signin')[0], $('#signout')[0]);
});