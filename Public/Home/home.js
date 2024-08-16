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
//Cloud Functions
const functions = getFunctions();
const checkUser = httpsCallable(functions, 'checkUser');
const getRecommendations = httpsCallable(functions, 'getRecommendations');

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

function getDate(ts) {
  // current timestamp in milliseconds

  let date_time = new Date(ts);
  let date = date_time.getDate();
  let month = date_time.getMonth() + 1;
  let year = date_time.getFullYear();

  // prints date & time in YYYY-MM-DD format
  return(month + "/" + date + "/" + year);
}

let currentActivity = null;
//Check User
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in as " + user.email)
    getRecommendations()
      .then((result) => {
        const recList = result.data.recList;
        const listDiv = document.getElementById("recList");
        recList.forEach(rec => {
          listDiv.innerHTML += 
          '<div class="w3-button w3-block w3-theme-l1 w3-left-align">'+ rec.type + '</div>' +
          '<div class="w3-container w3-theme-l2">' +
            '<h3 style="font-size: 16px;">Name: ' + rec.name + '</h3>' +
            '<h3 style="font-size: 16px;">Recommendation: ' + rec.recommendation + '</h3>' + 
            '<h3 style="font-size: 14px;">Message: ' + rec.message + '</h3>' +
          '</div>' + 
          '<br>';
        });
      });
    checkUser()
      .then((result) => {
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
    const gamechecklist = document.getElementById("gamechecklist");
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
  let hasChecked = false
  for (let i = 0; i < gameCheck.length; i++) {
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

function checkVoteModal() {
  const voteCheck = document.getElementsByName('voteCheck')
  const submitVoteBtn = document.getElementById("submitVoteBtn")
  let hasChecked = false
  for (let i = 0; i < voteCheck.length; i++) {
    if (voteCheck[i].checked) {
      hasChecked = true
      break;
    }
  }
  if (hasChecked) {
    submitVoteBtn.disabled = false
  }
  else {
    submitVoteBtn.disabled = true
  }
}
//Create Poll
const startpollbtn = document.getElementById("startpollbtn")
startpollbtn.addEventListener('click', startPoll);
function startPoll() {
  let numVoters = null
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
    let gameNames = [];
    for (let i = 0; i < gamecheck.length; i++) {
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
              email: user.email,
              uid: user.uid,
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
function sendVote() {
  const user = auth.currentUser;
  if (user) {
    checkUser()
    .then((result) => {
      /** @type {any} */
      const data = result.data;
      if (data.isMember) {
        let voteData = {
          email: user.email,
          uid: user.uid,
          votes: []
        }
        const voteCheck = document.getElementsByName("voteCheck");
        for (let i = 0; i < voteCheck.length; i++) {
          if (voteCheck[i].checked) {
            voteData.votes.push(voteCheck[i].value);
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
//Submit Runoff Vote
function sendRunoffVote() {
  const user = auth.currentUser;
  if (user) {
    checkUser()
    .then((result) => {
      /** @type {any} */
      const data = result.data;
      if (data.isMember) {
        let voteData = {
          email: user.email,
          uid: user.uid,
          votes: []
        }
        const voteCheck = document.getElementsByName("runoffCheck");
        for (let i = 0; i < voteCheck.length; i++) {
          if (voteCheck[i].checked) {
            voteData.votes.push(voteCheck[i].value);
          }
        }
        socket.emit('runoff-vote', voteData);
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
    '<h3 class="w3-center" style="font-size: 24px;">Movie Night - ' + getDate(data.date) + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;">Number of Voters: ' + data.maxVotes + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;" id="voteCount">Vote Count: ' + data.totalVotes + '</h3>' +
  '</div>' +
  '<hr>' + 
  '<h3 class="w3-center" style="font-size: 20px;">Nominations List:</h3>' +
  '<div class="w3-center" id="nominationList">' +
  '</div>' +
  '<hr>' +
  '<div class="w3-center" id="memberBtns">' +
  '</div>';
  const voteModalheader = document.getElementById("voteModalHeader");
  voteModalheader.innerHTML = '<h3 class="w3-center" style="font-size: 20px;">Movie Night - ' + getDate(data.date) + '</h3>'
  const user = auth.currentUser;
  if (user) {
    checkUser()
    .then((result) => {
      /** @type {any} */
      const data = result.data;
      if (data.isMember) {
        const memberBtns = document.getElementById("memberBtns");
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
        const submitVoteBtn = document.getElementById("submitVoteBtn");
        submitVoteBtn.addEventListener('click', sendVote);
        addNombtn.addEventListener('click', e => {
          if (movieName.value == '') {
            alert("Please enter a movie name")
          }
          else {
            let movieData = {
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
  const movieName = document.getElementById('movieName');
  movieName.value = '';
  if (data == "OK") {
    alert("Movie Successfully Nominated!");
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
  voteModalbody.innerHTML = '<br>';
  for (let i = 0; i < data.nominationsMap.length; i++) {
    const nominationName = data.nominationsMap[i][0];
    nominationList.innerHTML += 
      '<h3 class="w3-center" style="font-size: 16px;">' + nominationName + '</h3>';
    voteModalbody.innerHTML +=
      '<label>' + nominationName + ' </label>' +
      '<input class="w3-check" type="checkbox" name="voteCheck" value=\"' + nominationName + '\">' +
      '<br>' +
      '<br>';
  }
  beginVotingBtn.disabled = false;
});
//Start Movie Polling
socket.on('voting-started', data => {
  const addNombtn = document.getElementById('AddNominationbtn');
  const beginVotingBtn = document.getElementById('beginVotingBtn');
  const voteBtn = document.getElementById('voteBtn');
  const voteModalbody = document.getElementById("voteModalbody");
  const user = auth.currentUser;
  if (user) {
    checkUser()
      .then((result) => {
        /** @type {any} */
        const data = result.data;
        if (data.isMember) {
          voteModalbody.addEventListener('change', e => {
            checkVoteModal();
          });
          voteBtn.addEventListener('click', e => {
            document.getElementById('voteModal').style.display='block';
          });
          addNombtn.disabled = true;
          beginVotingBtn.disabled = true;
          voteBtn.disabled = false;
        }
      });
  }
  
  alert(data);
})
//Create/Begin Game Poll
socket.on('new-game-poll', data => {
  currentPollbody.innerHTML = 
  '<div class="w3-center">' +
    '<h3 class="w3-center" style="font-size: 24px;">Game Night - ' + getDate(data.date) + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;">Number of Voters: ' + data.maxVotes + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;" id="voteCount">Vote Count: ' + data.totalVotes + '</h3>' +
  '</div>' +
  '<hr>' + 
  '<h3 class="w3-center" style="font-size: 20px;">Nominations List</h3>' +
  '<div class="w3-center" id="nominationList">' +
  '</div>' +
  '<hr>' +
  '<div class="w3-center" id="memberBtns">' +
  '</div>';
  const memberBtns = document.getElementById("memberBtns");
  const nominationList = document.getElementById("nominationList");
  const voteModalheader = document.getElementById("voteModalHeader");
  voteModalheader.innerHTML = '<h3 class="w3-center" style="font-size: 20px;">Game Night - ' + getDate(data.date) + '</h3>'
  const voteModalbody = document.getElementById("voteModalbody");
  for (let i = 0; i < data.nominationsMap.length; i++) {
    nominationList.innerHTML += 
      '<h3 class="w3-center" style="font-size: 16px;">' + data.nominationsMap[i][0] + ': ' + ' Votes: ' + data.nominationsMap[i][1] + '</h3>';
    voteModalbody.innerHTML +=
      '<br>' +
      '<label>' + data.nominationsMap[i][0] + ' </label>' +
      '<input class="w3-check" type="checkbox" name="voteCheck" value="'+ data.nominationsMap[i][0] + '">' + 
      '<br>';
  }
  voteModalbody.innerHTML += '<br>';
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
          const voteModalbody = document.getElementById("voteModalbody");
          voteModalbody.addEventListener('change', e => {
            checkVoteModal();
          });
          const submitVoteBtn = document.getElementById("submitVoteBtn");
          submitVoteBtn.addEventListener('click', sendVote);
        }
      });
  } else {
    alert("User is not logged in");
    window.location.href = "../index.html";
  }
});
//Response from Vote Submission
socket.on('vote-response', data => {
  const voteBtn = document.getElementById('voteBtn');
  voteBtn.disabled = true;
  if (data == "ERROR-1") {
    alert("Error - you have already voted in this poll");
  }
  else if (data == "OK") {
    alert("Vote Successfully Submitted!");
  }
});
//Update Poll
socket.on('update-count', data => {
  const voteCount = document.getElementById("voteCount");
  const nominationList = document.getElementById("nominationList");
  voteCount.innerHTML = 'Vote Count: ' + data.totalVotes
  nominationList.innerHTML = '';
  for (let i = 0; i < data.nominationsMap.length; i++) {
    const nominationName = data.nominationsMap[i][0];
    const votes = data.nominationsMap[i][1]
    nominationList.innerHTML += 
      '<h3 class="w3-center" style="font-size: 16px;">' + nominationName + ' Votes: ' + votes + '</h3>';
  }
});
//Runoff Poll
socket.on('runoff-poll', data => {
  const voteModalbody = document.getElementById("voteModalbody");
  const voteBtn = document.getElementById('voteBtn');
  const submitVoteBtn = document.getElementById("submitVoteBtn")
  submitVoteBtn.removeEventListener('click', sendVote);
  submitVoteBtn.addEventListener('click', sendRunoffVote);
  nominationList.innerHTML = '';
  voteModalbody.innerHTML = '<br>';
  for (let i = 0; i < data.runoffPoll.length; i++) {
    const nominationName = data.runoffPoll[i][0];
    voteModalbody.innerHTML +=
      '<label>' + nominationName + ' </label>' +
      '<input class="w3-radio" type="radio" name="runoffCheck" value=\"' + nominationName + '\">' +
      '<br>' +
      '<br>';
  }
  alert("We have a tie! Runoff Poll has been opened!");
  voteBtn.disabled = false;
})
socket.on('poll-results', data => {
  const currentPollbody = document.getElementById("currentPollbody");
  const pollResultsbody = document.getElementById("pollResultsbody");
  const user = auth.currentUser;
  if (user) {
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
  }
  pollResultsbody.innerHTML = 
    '<div class="w3-center">' +
    '<h3 class="w3-center" style="font-size: 24px;">' + data.activity + ' Night - ' + getDate(data.date) + '</h3>' +
    '<h3 class="w3-center" style="font-size: 16px;">Number of Voters: ' + data.maxVotes + '</h3>' +
    '</div>' +
    '<hr>' + 
    '<h3 class="w3-center" style="font-size: 20px;">Results List</h3>' +
    '<div class="w3-center" id="resultList">' +
    '</div>';
  const resultList = document.getElementById("resultList");
  for (let i = 0; i < data.nominationsMap.length; i++) {
    resultList.innerHTML += 
      '<h3 class="w3-center" style="font-size: 16px;">' + data.nominationsMap[i][0] + ': ' + ' Votes: ' + data.nominationsMap[i][1] + '</h3>';
  }
  if (data.activity == 'Movie') {
    if(data.runoffPoll.length != 0) {
      pollResultsbody.innerHTML += 
      '<hr>' + 
      '<h3 class="w3-center" style="font-size: 20px;">Runoff Poll</h3>' +
      '<div class="w3-center" id="runoffList">' +
      '</div>';
      const runoffList = document.getElementById("runoffList");
      for (let i = 0; i < data.runoffPoll.length; i++) {
        runoffList.innerHTML += 
        '<h3 class="w3-center" style="font-size: 16px;">' + data.runoffPoll[i][0] + ': ' + ' Votes: ' + data.runoffPoll[i][1] + '</h3>' +
        '<br>';
      }
    }
    pollResultsbody.innerHTML += 
      '<hr>' + 
      '<h3 class="w3-center" style="font-size: 20px;">Winner: ' + data.winner + '</h3>';
  }
})

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
