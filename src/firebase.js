import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDuIbTXnX-wkywy1KHyY40_mxcf2P6teAE",
    authDomain: "react-slack-chat-774ad.firebaseapp.com",
    databaseURL: "https://react-slack-chat-774ad.firebaseio.com",
    projectId: "react-slack-chat-774ad",
    storageBucket: "react-slack-chat-774ad.appspot.com",
    messagingSenderId: "50309527037",
    appId: "1:50309527037:web:cc149969718bbe396dd594",
    measurementId: "G-2QR6BV0807"
};
firebase.initializeApp(firebaseConfig);

export default firebase;
