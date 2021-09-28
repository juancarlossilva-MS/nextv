import * as firebase from "firebase/app"

import '@firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAAhIog4GrHuLwqqD02jgFj4DEk1E3lm20",
  authDomain: "nextv-c8d74.firebaseapp.com",
  databaseURL: "https://nextv-c8d74-default-rtdb.firebaseio.com",
  projectId: "nextv-c8d74",
  storageBucket: "nextv-c8d74.appspot.com",
  messagingSenderId: "288137255844",
  appId: "1:288137255844:web:db8466f473b06477b6bf31"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

const fire = firebase;
export default fire;