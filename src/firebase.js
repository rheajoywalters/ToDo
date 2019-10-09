import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyB4QQAPtn56DyIZO9b3iH9isSgAk4Jl3jU",
  authDomain: "todo-f852a.firebaseapp.com",
  databaseURL: "https://todo-f852a.firebaseio.com",
  projectId: "todo-f852a",
  storageBucket: "todo-f852a.appspot.com",
  messagingSenderId: "976982143493",
  appId: "1:976982143493:web:a16ee04f76597e7a80a26c",
  measurementId: "G-Q3KTNQ1P1N"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
