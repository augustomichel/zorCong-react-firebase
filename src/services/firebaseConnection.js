import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyCaA0BvV98pkdFYb3t_M5iWbkMpLHn7yPY",
    authDomain: "zorzanellocon.firebaseapp.com",
    projectId: "zorzanellocon",
    storageBucket: "zorzanellocon.appspot.com",
    messagingSenderId: "587148308992",
    appId: "1:587148308992:web:4aed768d3f184f16729ee5"
  };

 if(!firebase.apps.length){
     firebase.initializeApp(firebaseConfig);
 }

 export default firebase;