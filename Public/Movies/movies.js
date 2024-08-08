import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";

const functions = getFunctions();
const getMovieHistory = httpsCallable(functions, 'getMovieHistory');

const homebtn = document.getElementById("homebtn")
const gamesbtn = document.getElementById("gamesbtn")
const recommendbtn = document.getElementById("recommendbtn")

homebtn.addEventListener('click', e=> { 
        window.location.href = "../Home/home.html"
})
gamesbtn.addEventListener('click', e=> { 
    window.location.href = "../Games/games.html"
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
    return(month + "/" + date + "/" + year);
  }

onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Logged in as " + user.email)
      getMovieHistory()
        .then((result) => {
          const pollList = result.pollList;
          const listDiv = document.getElementById("pollList");
          pollList.forEach(poll => {
            const pollDate = getDate(poll.date)
            listDiv.innerHTML += 
            '<button onclick="myFunction(\'' + pollDate + '\')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-film fa-fw w3-margin-right"></i> '+ pollDate + '</button>'
            '<div id=\"' + pollDate + '\" class="w3-hide w3-container">'
            '</div>';
            const innerDiv = document.getElementById(pollDate);
            innerDiv.innerHTML = '<h3 class="w3-center" style="font-size: 16px;">Number of Votes: ' + poll.votes + '</h3>'
            poll.nominations.forEach(nomination => {
                innerDiv.innerHTML += 
                '<h3 style="font-size: 16px;">' + nomination + '</h3>';
            });
            innerDiv.innerHTML += '<h3 class="w3-center" style="font-size: 16px;">Winner: ' + poll.winner + '</h3>'
          });
        });
    } else {
      alert("User is not logged in");
      window.location.href = "../index.html";
    }
  });