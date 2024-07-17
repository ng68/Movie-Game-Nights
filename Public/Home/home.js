import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
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


const moviesbtn = document.getElementById("moviesbtn")
const gamesbtn = document.getElementById("gamesbtn")
const recommendbtn = document.getElementById("recommendbtn")
const activepoll = document.getElementById("activepoll")
const polldiv = document.getElementById("polldiv")

//const socket = io();
moviesbtn.addEventListener('click', e=> { 
    window.location.href = "../Movies/movies.html"
})
gamesbtn.addEventListener('click', e=> { 
    window.location.href = "../Games/games.html"
})
recommendbtn.addEventListener('click', e=> { 
    window.location.href = "../Recommend/recommend.html"
})

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    const uid = user.uid;
    //socket.emit()
  } else {
    window.location.href = "../index.html"
  }
});

/*socket.on('user-checked', data => {
    if(data.isAdmin){
        
    }
});*/


