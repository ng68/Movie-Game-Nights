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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
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
                setTimeout (() => {socket.emit('new-movie-nomination', activePoll);}, 1500);  
            }
            if (activePoll.open == true) {
                setTimeout (() => {socket.emit('voting-started', "Voting has been opened!");}, 1500);   
            }
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
                //Central Time
                date: (Date.now() - (1000 * 60 * 60 * 5)),
                activity: 'movie',
                maxVotes: data.maxVotes,
                totalVotes: 0,
                nominationsMap: [],
                open: false,
                runoffPoll: []
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
                //Central Time
                date: (Date.now() - (1000 * 60 * 60 * 5)),
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
                    var name = activePoll.nominationsMap[i][0];
                    if (name == vote) {
                        activePoll.nominationsMap[i][1]++;
                        break;
                    }
                }
            });
            activePoll.totalVotes++;
            socket.emit('vote-response', "OK");
            setTimeout (() => {socket.emit('update-count', activePoll);}, 1000);
            if (activePoll.totalVotes == activePoll.maxVotes) {
                //Calculate Vote Winner
                var topVote = ["", 0];
                const voteMap = activePoll.nominationsMap
                if (activePoll.activity == 'movie') {
                    for (var i = 0; i < voteMap.length; i++) {
                        if (voteMap[i][1] > topVote[1]) {
                            topVote = voteMap[i];
                        }
                    }
                    for (var j = 0; j < voteMap.length; j++) {
                        if (voteMap[j][0] == topVote[0]) {
                            continue;
                        }
                        else if (voteMap[j][1] == topVote[1]) {
                            activePoll.runoffPoll.push([voteMap[j][0] , 0])
                        }
                    }
                    if (activePoll.runoffPoll.length != 0) {
                        activePoll.runoffPoll.push([topVote[0], 0]);
                        voterTrack = [];
                        activePoll.totalVotes = 0
                        setTimeout (() => {homeNamespace.emit('runoff-poll', activePoll);}, 1000);
                    }
                    else {
                        nominatorTrack = [];
                        voterTrack = [];
                        activePoll.winner = topVote[0];
                        setTimeout (() => {homeNamespace.emit('poll-results', activePoll);}, 1500);
                        setTimeout (() => {socket.emit('store-poll', activePoll);}, 1000);
                    }
                }
                else {
                    voterTrack = [];
                    setTimeout (() => {socket.emit('poll-results', activePoll);}, 1500);
                    setTimeout (() => {socket.emit('store-poll', activePoll);}, 1000);
                }
            }
        }
    })
    socket.on('runoff-vote', data => {
        if (voterTrack.includes(data.uid)) {
            socket.emit('vote-response', "ERROR-1");
        }
        else {
            voterTrack.push(data.uid);
            for (var i = 0; i < activePoll.runoffPoll.length; i++) {
                var name = activePoll.runoffPoll[i][0];
                if (name == data.votes[0]) {
                    activePoll.runoffPoll[i][1]++;
                    break;
                }
            }
            activePoll.totalVotes++;
            socket.emit('vote-response', "OK");
            if (activePoll.totalVotes == activePoll.maxVotes) {
                //Calculate Vote Winner
                var topVote = ["", 0];
                const voteMap = activePoll.runoffPoll
                var tie = [];
                for (var i = 0; i < voteMap.length; i++) {
                    if (voteMap[i][1] > topVote[1]) {
                        topVote = voteMap[i];
                    }
                }
                for (var j = 0; j < voteMap.length; j++) {
                    if (voteMap[j][0] == topVote[0]) {
                        continue;
                    }
                    else if (voteMap[j][1] == topVote[1]) {
                        tie.push(voteMap[j][0])
                    }
                }
                if (tie.length != 0) {
                    tie.push(topVote[0]);
                    const winner = tie[getRandomInt(tie.length)];
                    setTimeout (() => {homeNamespace.emit('winner', winner);}, 1500);
                }
                else {
                    setTimeout (() => {homeNamespace.emit('winner', topVote[0]);}, 1500);
                }
            }
        }
    })
})
