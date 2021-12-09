import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyB38k5xN3V1xjdbTDfKnaalmrtm3J-IKvg",
    authDomain: "comhood-b84b8.firebaseapp.com",
    projectId: "comhood-b84b8",
    storageBucket: "comhood-b84b8.appspot.com",
    messagingSenderId: "633149241062",
    appId: "1:633149241062:web:a37e2d5bec54792644ad27",
    measurementId: "${config.measurementId}"
};

let app;
if (firebase.apps.length == 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth()

export { auth };