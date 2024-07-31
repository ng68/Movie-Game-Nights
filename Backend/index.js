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

homeNamespace.on('connection', socket => {
    console.log("homepage connected");
    //Send Active Poll to newly connected User
    socket.on('request-poll', data => {
        if(activePoll == null) {
            socket.emit("poll-response", "No active poll found");
        }
        else if(activePoll.activity == 'movie') {
            socket.emit("new-movie-poll", activePoll);
        }
        else if(activePoll.activity == 'game') {
            socket.emit("new-game-poll", activePoll);
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
                activity: 'movie',
                maxVotes: data.maxVotes,
                totalVotes: 0,
                nominationsMap: [],
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
            data.nominations.forEach(name => {
                votesMap.set(name, 0);
            });
            activePoll = {
                activity: 'game',
                maxVotes: data.numVoters,
                totalVotes: 0,
                nominationsMap: []
            };
            homeNamespace.emit('new-game-poll', activePoll);
        }
    });
    socket.on('add-movie', data => {
        if (nominatorTrack.includes(data.uid)) {
            socket.emit('add-movie-response', "ERROR-1");
        }
        else {
            nominatorTrack.push(data.uid);
            var newNom = [data.name, 0]
            activePoll.nominationsMap.push(newNom);
            homeNamespace.emit('new-movie-nomination', activePoll.nominationsMap);
            socket.emit('add-movie-response', "OK"); 
        }
    });
    socket.on('begin-vote', data => {
        if (activePoll.nominations.size == 0) {
            socket.emit('voting-started', "ERROR-1");
        }
        else {
            console.log(data + " Began Voting");
            homeNamespace.emit('voting-started', activePoll);
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
