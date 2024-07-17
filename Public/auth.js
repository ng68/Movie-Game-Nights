import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const signin = document.getElementById("signin")
const firebaseConfig = {
    apiKey: "AIzaSyB05-JI2yJoQK5XQ7GzyiCjI_WymHj2EO4",
    authDomain: "movie-and-game-nights.firebaseapp.com",
    databaseURL: "https://movie-and-game-nights-default-rtdb.firebaseio.com",
    projectId: "movie-and-game-nights",
    storageBucket: "movie-and-game-nights.appspot.com",
    messagingSenderId: "141273252315",
    appId: "1:141273252315:web:0c56f7dc95c90e8aefa7fe",
    measurementId: "G-LYD4S8DDLX"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
signin.addEventListener('click', e=> { 
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        window.location.href = "Home/home.html"
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
})

