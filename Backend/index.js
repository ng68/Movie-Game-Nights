const port = process.env.PORT;
if (port == null || port == "") {
	port = 8080;
}
const { Server } = require("socket.io");
const io = new Server(port, {
  cors: {
    origin: ["https://movie-and-game-nights.web.app", "https://movie-and-game-nights.firebaseapp.com"]
  }
});

const homeNamespace = io.of('/home');

var activePoll = null;
var nominatorTrack = [];
var voterTrack = []; 

function getDate() {
    // current timestamp in milliseconds
    let ts = Date.now();
  
    let date_time = new Date(ts);
    let date = date_time.getDate();
    let month = date_time.getMonth() + 1;
    let year = date_time.getFullYear();
  
    // prints date & time in YYYY-MM-DD format
    return(month + "/" + date + "/" + year);
}

homeNamespace.on('connection', socket => {
    console.log("homepage connected");
    //Send Active Poll to newly connected User
    socket.on('request-poll', data => {
        if(activePoll == null) {
            socket.emit("poll-response", "No active poll found");
        }
        else if(activePoll.activity == 'movie') {
            socket.emit("new-movie-poll", activePoll);
            if (activePoll.nominationsMap.length != 0) {
                socket.emit("new-movie-nomination", activePoll);
            }
            if (activePoll.open == true) {
                setTimeout (() => {socket.emit('voting-started', "Voting has been opened!");}, 2000);
                
            }
        }
        else if(activePoll.activity == 'game') {
            socket.emit("new-game-poll", activePoll);
            socket.emit("update-poll", activePoll);
        }
    })
    socket.on('create-movie-poll', data => {
        if (activePoll != null) {
            socket.emit('error', "Active Poll is not null");
        }
        else {
            nominatorTrack = [];
            voterTrack = [];
            activePoll = {
                date: getDate(),
                activity: 'movie',
                maxVotes: data.maxVotes,
                totalVotes: 0,
                nominationsMap: [],
                open: false,
                runoffPoll: null
            };
            homeNamespace.emit('new-movie-poll', activePoll);
        }
    });
    socket.on('create-game-poll', data => {
        if (activePoll != null) {
            socket.emit('error', "Active Poll is not null");
        }
        else {
            voterTrack = [];
            var votesMap = [];
            data.nominations.forEach(name => {
                votesMap.push([name, 0]);
            });
            activePoll = {
                date: getDate(),
                activity: 'game',
                maxVotes: data.numVoters,
                totalVotes: 0,
                nominationsMap: votesMap
            };
            homeNamespace.emit('new-game-poll', activePoll);
        }
    });
    socket.on('add-movie', data => {
        if (nominatorTrack.includes(data.uid)) {
            socket.emit('add-movie-response', "ERROR-1");
        }
        else if (nominatorTrack.length == activePoll.maxVotes) {
            socket.emit('add-movie-response', "ERROR-2");
        }
        else {
            nominatorTrack.push(data.uid);
            console.log("New Movie Added: " + data.name);
            var newNom = [data.name, 0]
            activePoll.nominationsMap.push(newNom);
            homeNamespace.emit('new-movie-nomination', activePoll);
            socket.emit('add-movie-response', "OK"); 
        }
    });
    socket.on('begin-vote', data => {
        if (activePoll.nominationsMap.size == 0) {
            socket.emit('voting-started', "ERROR-1");
        }
        else {
            activePoll.open = true;
            console.log(data + " Initiated Voting");
            homeNamespace.emit('voting-started', "Voting has been opened!" );
        }
    })
    socket.on('vote', data => {
        if (voterTrack.includes(data.uid)) {
            socket.emit('vote-response', "ERROR-1");
        }
        else {
            voterTrack.push(data.uid);
            data.votes.forEach(vote => {
                for (var i = 0; i < activePoll.nominationsMap.length; i++) {
                    if (nominationsMap[i][0] == vote) {
                        (nominationsMap[i][1])++;
                        break;
                    }
                }
            });
            activePoll.totalVotes++;
            socket.emit('vote-response', "OK");
            homeNamespace.emit('update-poll', activePoll)
        }
    })
})
