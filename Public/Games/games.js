import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";
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
const auth = getAuth();

const functions = getFunctions();
const getGameHistory = httpsCallable(functions, 'getGameHistory');
const homebtn = document.getElementById("homebtn")
const moviesbtn = document.getElementById("moviesbtn")
const recommendbtn = document.getElementById("recommendbtn")

homebtn.addEventListener('click', e=> { 
        window.location.href = "../Home/home.html"
})
moviesbtn.addEventListener('click', e=> { 
    window.location.href = "../Movies/movies.html"
})
recommendbtn.addEventListener('click', e=> { 
    window.location.href = "../Recommend/recommend.html"
})

function getDate(ts) {
    // current timestamp in milliseconds
  
    let date_time = new Date(ts);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
  
    // prints date & time in YYYY-MM-DD format
    console.log("Date converted to: " + month + "/" + date + "/" + year)
    return(month + "/" + date + "/" + year);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
      getMovieHistory()
        .then((result) => {
          const pollList = result.data.pollList;
          const listDiv = document.getElementById("pollList");
          pollList.forEach(poll => {
            console.log("Poll Date: " + poll.date)
            const pollDate = getDate(poll.date)
            listDiv.innerHTML += 
            '<button onclick="pollDetails(\'' + pollDate + '\')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-gamepad fa-fw w3-margin-right"></i> '+ pollDate + '</button>' +
            '<div id=\"' + pollDate + '\" class="w3-hide w3-container w3-theme-l2">' +
            '</div>';
            const innerDiv = document.getElementById(pollDate);
            innerDiv.innerHTML = '<h3 class="w3-center" style="font-size: 16px;">Number of Votes: ' + poll.voters + '</h3>' + 
            '<h3 class="w3-center" style="font-size: 16px;">Nominations:</h3>'
            poll.nominations.forEach(nomination => {
                innerDiv.innerHTML += 
                '<h3 style="font-size: 14px;">' + nomination + '</h3>';
            });
            innerDiv.innerHTML += '<h3 class="w3-center" style="font-size: 16px;">Top Picks: ' + poll.top3[0] + ', ' + poll.top3[1] + ', ' + poll.top3[2] + '</h3>'
          });
        });
    } else {
      alert("User is not logged in");
      window.location.href = "../index.html";
    }
  });