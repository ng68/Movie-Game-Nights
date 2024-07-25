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

//const socket = io();
const moviesbtn = document.getElementById("moviesbtn")
const gamesbtn = document.getElementById("gamesbtn")
const recommendbtn = document.getElementById("recommendbtn")
const activepoll = document.getElementById("activepoll")
const polldiv = document.getElementById("polldiv")

const activitybtn = document.getElementById("activitybtn")
activitybtn.addEventListener('click', e => {
  toggleDropdown()
})
const activitymoviebtn = document.getElementById("activitymoviebtn")
activitymoviebtn.addEventListener('click', e => {
  changeActivity('movie')
})
const activitygamebtn = document.getElementById("activitygamebtn")
activitygamebtn.addEventListener('click', e => {
  changeActivity('game')
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

function toggleDropdown() {
  const x = document.getElementById("activitydropdown") 
  if (x.className.indexOf("w3-show") == -1) { 
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

function updateActivityDropdown(selectedActivity) {
  const activitybtn = document.getElementById("activitybtn")
  const activitydropdown = document.getElementById("activitydropdown")
  if (selectedActivity == 'movie') {
    activitybtn.innerHTML = 'Movie Night'
    activitydropdown.innerHTML = '<a id="activitygamebtn" class="w3-bar-item w3-button w3-indigo w3-hover-blue">Game Night</a>'
    const activitygamebtn = document.getElementById("activitygamebtn")
    activitygamebtn.addEventListener('click', e=> {
        changeActivity('game')
    })
  }
  else if (selectedActivity == 'game') {
    activitybtn.innerHTML = 'Game Night'
    activitydropdown.innerHTML = '<a id="activitymoviebtn" class="w3-bar-item w3-button w3-indigo w3-hover-blue">Movie Night</a>'
    const activitymoviebtn = document.getElementById("activitymoviebtn")
    activitymoviebtn.addEventListener('click', e=> {
        changeActivity('movie')
    })
  }
}
function changeActivity(activity) {
  const pollbody = document.getElementById("pollbody")
  const startpollbtn = document.getElementById("startpollbtn")
  //Movie Night Modal Version
  if (activity == 'movie') {
    toggleDropdown()
    updateActivityDropdown('movie')
    pollbody.innerHTML = 
      '<p><label><i class="fa fa-male"></i> Number of Voters</label></p>' +
      '<select id="numMovieVoters" class="w3-select w3-border" name="Voters">' +
        '<option value="" disabled selected>0</option>' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4">4</option>' +
        '<option value="5">5</option>' +
        '<option value="6">6</option>' +
        '<option value="7">7</option>' +
        '<option value="8">8</option>' +
      '</select>' +
      '<br>' +
      '<br>';
    const numMovieVoters = document.getElementById("numMovieVoters")
    numMovieVoters.addEventListener('change', e => {
      startpollbtn.disabled = false
    })

    //startpollbtn.removeEventListener('click', startGamePoll());
    //startpollbtn.addEventListener('click', startMoviePoll());
  }
  //Game Night Modal Version
  else if (activity == 'game') {
    toggleDropdown()
    updateActivityDropdown('game')
    pollbody.innerHTML = 
      '<div id="gamechecklist">' +
      '</div>' +
      '<br>' +
      '<div>' +
          '<label><b>Add another game</b></label>' +
          '<input class="w3-input w3-border" type="text" id="otherGame">' +
          '<br>' +
          '<button class="w3-button w3-green" id="AddGamebtn">Add Game</button>' +
      '</div>' +
      '<br>' +
      '<div>' +
        '<p><label><i class="fa fa-male"></i> Number of Voters</label></p>' +
        '<select id="numGameVoters" class="w3-select w3-border" name="Voters">' +
          '<option value="0" disabled selected>0</option>' +
          '<option value="1">1</option>' +
          '<option value="2">2</option>' +
          '<option value="3">3</option>' +
          '<option value="4">4</option>' +
          '<option value="5">5</option>' +
          '<option value="6">6</option>' +
          '<option value="7">7</option>' +
          '<option value="8">8</option>' +
        '</select>' +
      '</div>' +
      '<br>';
    const gamechecklist = document.getElementById("gamechecklist")
    gamechecklist.innerHTML = 
      '<br>' +
      '<input class="w3-check" type="checkbox" name="gamecheck" value="Skribbl.io">' +
      '<label> Skribbl.io</label>' +
      '<br>' +
      '<input class="w3-check" type="checkbox" name="gamecheck" value="Codenames">' +
      '<label> Codenames</label>' +
      '<br>' +
      '<input class="w3-check" type="checkbox" name="gamecheck" value="Rainbow Six Siege">' +
      '<label> Rainbow Six Siege</label>' +
      '<br>' +
      '<input class="w3-check" type="checkbox" name="gamecheck" value="Europa Universalis 4">' +
      '<label> Europa Universalis 4</label>' +
      '<br>' +
      '<input class="w3-check" type="checkbox" name="gamecheck" value="Golf With Your Friends">' +
      '<label> Golf With Your Friends</label>' +
      '<br>' +
      '<input class="w3-check" type="checkbox" name="gamecheck" value="Pummel Party">' +
      '<label> Pummel Party</label>' +
      '<br>';
    const gameName = document.getElementById('otherGame')
    const addGamebtn = document.getElementById("AddGamebtn")
    const numGameVoters = document.getElementById('numGameVoters')
    addGamebtn.addEventListener('click', e => {
        if (gameName.value == '') {
          alert("Please enter a game")
        }
        else {
          gamechecklist.innerHTML = gamechecklist.innerHTML + 
          '<input class="w3-check" checked="checked" type="checkbox" name="gamecheck" value='+ gameName.value + '>' +
          '<label> ' + gameName.value + '</label>' +
          '<br>';
          gameName.value = ''
          if (numGameVoters.selectedIndex != 0) {
            startpollbtn.disabled = false
          }
        }
    })
    //startpollbtn.removeEventListener('click', startMoviePoll());
    //startpollbtn.addEventListener('click', startGamePoll());
    
    //Enables Start Poll Button if at least one box is checked
    gamechecklist.addEventListener('change', e => {
      checkGameModal()
    })
    numGameVoters.addEventListener('change', e => {
      checkGameModal()
    })
  }
}

function startGamePoll() {

}

function startMoviePoll() {

}

function checkGameModal() {
  const gameCheck = document.getElementsByName('gamecheck')
  const numGameVoters = document.getElementById('numGameVoters')
  const startpollbtn = document.getElementById("startpollbtn")
  var hasChecked = false
  for (var i = 0; i < gameCheck.length; i++) {
    if (gameCheck[i].checked) {
      hasChecked = true
      break;
    }
  }
  if (hasChecked && numGameVoters.selectedIndex != 0) {
    startpollbtn.disabled = false
  }
  else if (!hasChecked || numGameVoters.selectedIndex == 0){
    startpollbtn.disabled = true
  }
}


moviesbtn.addEventListener('click', e=> { 
    window.location.href = "../Movies/movies.html"
})
gamesbtn.addEventListener('click', e=> { 
    window.location.href = "../Games/games.html"
})
recommendbtn.addEventListener('click', e=> { 
    window.location.href = "../Recommend/recommend.html"
})


/*startpollbtn.addEventListener('click', e => {
  
})*/



/*socket.on('user-checked', data => {
    if(data.isAdmin){
        
    }
});*/


