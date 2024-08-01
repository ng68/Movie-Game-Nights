import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-functions.js";

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
const socket = io("https://movie-game-nights.onrender.com/home");
const auth = getAuth();
//Backend Functions
const functions = getFunctions();
const checkUser = httpsCallable(functions, 'checkUser');
const createPoll = httpsCallable(functions, 'createPoll');

const moviesbtn = document.getElementById("moviesbtn")
const gamesbtn = document.getElementById("gamesbtn")
const recommendbtn = document.getElementById("recommendbtn")
const currentPollbody = document.getElementById("currentPollbody")

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

var currentActivity = null;
//Check User
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in as " + user.email)
    checkUser()
      .then((result) => {
        /** @type {any} */
        const data = result.data;
        if (data.isMember) {
          console.log("Verified as Member")
          currentPollbody.innerHTML = 
            '<div class="w3-bar">' + 
              '<button type="button" class="w3-button w3-theme w3-center w3-blue" onclick="document.getElementById(\'newpoll\').style.display=\'block\'"><i class="fa fa-pencil-square-o"></i>  Create New Poll</button>' +
            '</div>';
        }
      });
    socket.emit('request-poll');
  } else {
    alert("User is not logged in");
    window.location.href = "../index.html";
  }
});

socket.on("poll-response", data => {
  console.log(data);
})

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
    currentActivity = 'movie'
    pollbody.innerHTML = 
      '<p><label><i class="fa fa-male"></i> Number of Voters</label></p>' +
      '<select id="numMovieVoters" class="w3-select w3-border" name="Voters">' +
        '<option value="" disabled selected>0</option>' +
        '<option value=1>1</option>' +
        '<option value=2>2</option>' +
        '<option value=3>3</option>' +
        '<option value=4>4</option>' +
        '<option value=5>5</option>' +
        '<option value=6>6</option>' +
        '<option value=7>7</option>' +
        '<option value=8>8</option>' +
      '</select>' +
      '<br>' +
      '<br>';
    const numMovieVoters = document.getElementById("numMovieVoters")
    numMovieVoters.addEventListener('change', e => {
      startpollbtn.disabled = false
    })
  }
  //Game Night Modal Version
  else if (activity == 'game') {
    toggleDropdown()
    updateActivityDropdown('game')
    currentActivity = 'game'
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
          '<input class="w3-check" checked="checked" type="checkbox" name="gamecheck" value=\"' + gameName.value + '\">' +
          '<label> ' + gameName.value + '</label>' +
          '<br>';
          gameName.value = ''
          if (numGameVoters.selectedIndex != 0) {
            startpollbtn.disabled = false
          }
        }
    })
    
    //Enables Start Poll Button if at least one box is checked
    gamechecklist.addEventListener('change', e => {
      checkGameModal()
    })
    numGameVoters.addEventListener('change', e => {
      checkGameModal()
    })
  }
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
//Create Poll
const startpollbtn = document.getElementById("startpollbtn")
startpollbtn.addEventListener('click', startPoll);
function startPoll() {
  var numVoters = null
  if (currentActivity == 'movie') {
    numVoters = document.getElementById('numMovieVoters').selectedIndex
    const user = auth.currentUser;
    if (user) {
      checkUser()
        .then((result) => {
          /** @type {any} */
          const data = result.data;
          if (data.isMember) {
            const pollData = {
              email: user.email,
              uid: user.uid,
              maxVotes: numVoters
            };
            console.log("Sending Poll Data...");
            socket.emit('create-movie-poll', pollData)
            document.getElementById('newpoll').style.display='none'
          }
        });
    } else {
      alert("User is not logged in");
      window.location.href = "../index.html";
    }
;
  }
  else if (currentActivity == 'game') {
    numVoters = document.getElementById('numGameVoters').selectedIndex
    const gamecheck = document.getElementsByName('gamecheck');
    var gameNames = [];
    for (var i = 0; i < gamecheck.length; i++) {
      if (gamecheck[i].checked) {
        gameNames.push(gamecheck[i].value);
      }
    }
    const user = auth.currentUser;
    if (user) {
      checkUser()
        .then((result) => {
          /** @type {any} */
          const data = result.data;
          if (data.isMember) {
            const pollData = {
              email: email,
              uid: uid,
              maxVotes: numVoters,
              nominations: gameNames
            }
            socket.emit('create-game-poll', pollData)
            document.getElementById('newpoll').style.display='none'
          }
        });
    } else {
      window.location.href = "../index.html"
    }
  }
}
//Submit Vote
const submitVoteBtn = document.getElementById("submitVoteBtn")
submitVoteBtn.addEventListener('click', sendVote);
function sendVote() {
  console.log("Sending Vote...");
  const user = auth.currentUser;
  if (user) {
    checkUser()
    .then((result) => {
      /** @type {any} */
      const data = result.data;
      if (data.isMember) {
        var voteData = {
          email: user.email,
          uid: user.uid,
          votes: []
        }
        const voteCheck = document.getElementsByName("voteCheck");
        for (var i = 0; i < voteCheck.length; i++) {
          if (voteCheck[i].checked) {
            voteData.votes.push(voteCheck.value);
          }
        }
        socket.emit('vote', voteData);
        document.getElementById('voteModal').style.display='none';
      }
    });
  } else {
    alert("User is not logged in");
    window.location.href = "../index.html";
  }
}

//Create New Movie Poll 
socket.on('new-movie-poll', data => {
  currentPollbody.innerHTML = 
  '<div class="w3-center">' +
    '<h3 class="w3-center" style="font-size: 24px;">Movie Night - ' + data.date + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;">Number of Voters: ' + data.maxVotes + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;">Vote Count: ' + data.totalVotes + '</h3>' +
  '</div>' +
  '<hr>' + 
  '<h3 class="w3-center" style="font-size: 20px;">Nominations List:</h3>' +
  '<div class="w3-center" id="nominationList">' +
  '</div>' +
  '<hr>' +
  '<div class="w3-center" id="memberBtns">' +
  '</div>';
  const voteModalheader = document.getElementById("voteModalHeader");
  if (data.activity == 'movie') {
    voteModalheader.innerHTML = 
    '<h3 class="w3-center" style="font-size: 20px;">Movie Night - ' + data.date + '</h3>'
  }
  else if (data.activity == 'game') {
    voteModalheader.innerHTML = 
    '<h3 class="w3-center" style="font-size: 20px;">Game Night - ' + data.date + '</h3>'
  }
  const memberBtns = document.getElementById("memberBtns");
  const user = auth.currentUser;
  if (user) {
    checkUser()
    .then((result) => {
      /** @type {any} */
      const data = result.data;
      if (data.isMember) {
        memberBtns.innerHTML = 
        '<label><b>Movie Name</b></label>' +
        '<input class="w3-input w3-border" type="text" id="movieName">' +
        '<br>' +
        '<button class="w3-button w3-green" id="AddNominationbtn">Add Nomination</button>' +
        '<br>' +
        '<br>' +
        '<button class="w3-button w3-blue" id="voteBtn" disabled>Vote</button>' +
        '<br>' +
        '<br>' +
        '<button class="w3-button w3-black" id="beginVotingBtn" disabled>Begin Voting</button>';
        const movieName = document.getElementById('movieName');
        const addNombtn = document.getElementById('AddNominationbtn');
        const beginVotingBtn = document.getElementById('beginVotingBtn');
        addNombtn.addEventListener('click', e => {
          if (movieName.value == '') {
            alert("Please enter a movie name")
          }
          else {
            var movieData = {
              name: movieName.value,
              email: user.email,
              uid: user.uid
            }
            socket.emit('add-movie', movieData);
          }
        })
        beginVotingBtn.addEventListener('click', e => {
          socket.emit('begin-vote', user.email);
        })
      }
    }); 
  } else {
    alert("User is not logged in");
    window.location.href = "../index.html";
  }
});  
//Movie Nomination Added Response
socket.on('add-movie-response', data => {
  const addNombtn = document.getElementById('AddNominationbtn');
  if (data == "OK") {
    alert("Movie Successfully Nominated!")
    addNombtn.disabled = true;
  }
  else if (data == "ERROR-1") {
    alert("Error - You have already submitted a nomination");
    addNombtn.disabled = true;
  }
  else if (data == "ERROR-2") {
    alert("Error - You have already submitted a nomination");
    addNombtn.disabled = true;
  }
});
//Update Movie Nominations List
socket.on('new-movie-nomination', data => {
  const nominationList = document.getElementById('nominationList');
  const voteModalbody = document.getElementById("voteModalbody");
  const beginVotingBtn = document.getElementById('beginVotingBtn');
  nominationList.innerHTML = '';
  voteModalbody.innerHTML = '';
  for (var i = 0; i < data.nominationsMap.length; i++) {
    const nominationName = data.nominationsMap[i][0];
    const votes = data.nominationsMap[i][1];
    nominationList.innerHTML += 
      '<h3 class="w3-center" style="font-size: 16px;">' + nominationName + ' - ' + ' Votes: ' + votes + '</h3>' +
      '<br>';
    voteModalbody.innerHTML +=
      '<br>' +
      '<label>' + nominationName + ' </label>' +
      '<input class="w3-check" type="checkbox" name="voteCheck" value=\"' + nominationName + '\">' +
      '<br>';
  }
  beginVotingBtn.disabled = false;
});
//Start Movie Polling
socket.on('voting-started', data => {
  alert(data);
  const beginVotingBtn = document.getElementById('beginVotingBtn');
  const voteBtn = document.getElementById('voteBtn');
  voteBtn.addEventListener('click', e => {
    document.getElementById('voteModal').style.display='block';
  });
  beginVotingBtn.disabled = true;
  voteBtn.disabled = false;
})
//Create/Begin Game Poll
socket.on('new-game-poll', data => {
  currentPollbody.innerHTML = 
  '<div class="w3-center">' +
    '<h3 class="w3-center" style="font-size: 24px;">Game Night - ' + data.date + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;">Number of Voters: ' + data.maxVotes + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;" id="voteCount">Vote Count: ' + data.totalVotes + '</h3>' +
  '</div>' +
  '<h3 class="w3-center" style="font-size: 20px;">Nominations List</h3>' +
  '<div class="w3-center" id="nominationList">' +
  '</div>' +
  '<hr>' +
  '<div class="w3-center" id="memberBtns">' +
  '</div>';
  const memberBtns = document.getElementById("memberBtns");
  const nominationList = document.getElementById("nominationList");
  const voteModalbody = document.getElementById("voteModalbody");
  for (var i = 0; i < data.nominationsMap.length; i++) {
    nominationList.innerHTML += 
      '<br>' +
      '<h3 class="w3-center" style="font-size: 16px;">' + data.nominationsMap[i][0] + ': ' + ' Votes: ' + data.nominationsMap[i][1] + '</h3>' +
      '<br>';
    voteModalbody.innerHTML =+
      '<br>' +
      '<label>' + data.nominationsMap[i][0] + ' </label>' +
      '<input class="w3-check" type="checkbox" name="voteCheck" value="'+ data.nominationsMap[i][0] + '">' + 
      '<br>';
  }
  const user = auth.currentUser;
  if (user) {
    checkUser()
      .then((result) => {
        /** @type {any} */
        const data = result.data;
        if (data.isMember) {
          memberBtns.innerHTML = 
            '<br>' +
            '<button class="w3-button w3-blue" id="voteBtn">Vote</button>';
          const voteBtn = document.getElementById('voteBtn');
          voteBtn.addEventListener('click', e => {
            document.getElementById('voteModal').style.display='block';
          });
        }
      });
  } else {
    alert("User is not logged in");
    window.location.href = "../index.html";
  }
});
//Response from Vote Submission
socket.on('vote-response', data => {
  if (data == "ERROR-1") {
    alert("Error - you have already voted in this poll");
  }
  else if (data == "OK") {
    alert("Vote Successfully Submitted!");
  }
});
//Update Poll
socket.on('update-poll', data => {
  const voteCount = document.getElementById("voteCount");
  const nominationList = document.getElementById("nominationList");
  voteCount.innerHTML = 'Vote Count: ' + data.totalVotes
  nominationList.innerHTML = '';
  for (var i = 0; i < data.nominationsMap.length; i++) {
    nominationList.innerHTML += 
      '<br>' +
      '<h3 class="w3-center" style="font-size: 16px;">' + data.nominationsMap[i][0] + ': ' + ' Votes: ' + data.nominationsMap[i][1] + '</h3>' +
      '<br>';
  }
});

socket.on('error', data => {
  console.error(data);
})

moviesbtn.addEventListener('click', e=> { 
    window.location.href = "../Movies/movies.html"
})
gamesbtn.addEventListener('click', e=> { 
    window.location.href = "../Games/games.html"
})
recommendbtn.addEventListener('click', e=> { 
    window.location.href = "../Recommend/recommend.html"
})
