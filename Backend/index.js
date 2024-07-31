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
        if(activePoll.activity == 'movie') {
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
            var votesMap = new Map();
            nominatorTrack = new Map();
            voterTrack = [];
            nominatorTrack = [];
            activePoll = {
                activity: 'movie',
                maxVotes: data.maxVotes,
                totalVotes: 0,
                nominations: votesMap,
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
            var votesMap = new Map();
            voterTrack = [];
            data.nominations.forEach(name => {
                votesMap.set(name, 0);
            });
            activePoll = {
                activity: 'game',
                maxVotes: data.numVoters,
                totalVotes: 0,
                nominations: votesMap
            };
            homeNamespace.emit('new-game-poll', activePoll);
        }
    });
    socket.on('add-movie', data => {
        if (nominatorTrack.has(data.uid)) {
            socket.emit('add-movie-response', "ERROR-1");
        }
        else {
            nominatorTrack.set(data.uid, data.email);
            activePoll.nominations.set(data.name, 0);
            homeNamespace.emit('new-movie-nomination', activePoll.nominations);
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
        if (voterTrack.includes(data.email)) {
            socket.emit('vote-response', "ERROR-1");
        }
        else {
            voterTrack.push(data.email);
            data.votes.forEach(vote => {
                for (var [key, value] of activePoll.votesMap) {
                    if (vote == key) {
                        value++;
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
