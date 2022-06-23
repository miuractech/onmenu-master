import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'

const firebaseConfig = {
    apiKey: "AIzaSyCN3NTGJmiBq67fuN4eMj9DNlOWsGGVXzI",
    authDomain: "on-menu-802c7.firebaseapp.com",
    projectId: "on-menu-802c7",
    storageBucket: "on-menu-802c7.appspot.com",
    messagingSenderId: "638374482167",
    appId: "1:638374482167:web:d20465a774821ad33ec3f2",
    measurementId: "G-4N77W30Q13",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics()
export default firebase