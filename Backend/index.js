const axios = require("axios")
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

let activePoll = null;
let nominatorTrack = [];
let voterTrack = []; 

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function storeActivePoll() {
    axios({
        method: 'post',
        url: process.env.FUNCTION_URL, 
        data: activePoll
      });
}

function sortNominations(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

homeNamespace.on('connection', socket => {
    console.log("homepage connected");
    //Send Active Poll to newly connected User
    socket.on('request-poll', data => {
        if(activePoll == null) {
            socket.emit("poll-response", "No active poll found");
        }
        else if(activePoll.activity == 'Movie') {
            socket.emit("new-movie-poll", activePoll);
            if (activePoll.nominationsMap.length != 0) {
                setTimeout (() => {socket.emit('new-movie-nomination', activePoll);}, 1500);  
            }
            if (activePoll.open == true) {
                setTimeout (() => {socket.emit('voting-started', "Voting has been opened!");}, 1500);   
            }
        }
        else if(activePoll.activity == 'Game') {
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
                activity: 'Movie',
                maxVotes: data.maxVotes,
                totalVotes: 0,
                nominationsMap: [],
                open: false,
                runoffPoll: [],
                winner: ''
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
            let votesMap = [];
            data.nominations.forEach(name => {
                votesMap.push([name, 0]);
            });
            activePoll = {
                //Central Time
                date: (Date.now() - (1000 * 60 * 60 * 5)),
                activity: 'Game',
                maxVotes: data.maxVotes,
                totalVotes: 0,
                nominationsMap: votesMap,
                top3: []
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
            let newNom = [data.name, 0]
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
                for (let i = 0; i < activePoll.nominationsMap.length; i++) {
                    let name = activePoll.nominationsMap[i][0];
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
                let topVote = ["", 0];
                const voteMap = activePoll.nominationsMap
                if (activePoll.activity == 'Movie') {
                    for (let i = 0; i < voteMap.length; i++) {
                        if (voteMap[i][1] > topVote[1]) {
                            topVote = voteMap[i];
                        }
                    }
                    for (let j = 0; j < voteMap.length; j++) {
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
                        activePoll.nominationsMap.sort(sortNominations);
                        storeActivePoll();
                        socket.emit('poll-results', activePoll);
                        setTimeout (() => {activePoll = null;}, 1500);
                    }
                }
                else {
                    voterTrack = [];
                    activePoll.nominationsMap.sort(sortNominations);
                    activePoll.top3.push(activePoll.nominations[0][0], activePoll.nominations[1][0], activePoll.nominations[2][0])
                    storeActivePoll();
                    socket.emit('poll-results', activePoll);
                    setTimeout (() => {activePoll = null;}, 1500);
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
            for (let i = 0; i < activePoll.runoffPoll.length; i++) {
                let name = activePoll.runoffPoll[i][0];
                if (name == data.votes[0]) {
                    activePoll.runoffPoll[i][1]++;
                    break;
                }
            }
            activePoll.totalVotes++;
            socket.emit('vote-response', "OK");
            if (activePoll.totalVotes == activePoll.maxVotes) {
                //Calculate Vote Winner
                let topVote = ["", 0];
                const voteMap = activePoll.runoffPoll
                let tie = [];
                for (let i = 0; i < voteMap.length; i++) {
                    if (voteMap[i][1] > topVote[1]) {
                        topVote = voteMap[i];
                    }
                }
                for (let j = 0; j < voteMap.length; j++) {
                    if (voteMap[j][0] == topVote[0]) {
                        continue;
                    }
                    else if (voteMap[j][1] == topVote[1]) {
                        tie.push(voteMap[j][0])
                    }
                }
                if (tie.length != 0) {
                    tie.push(topVote[0]);
                    activePoll.winner = tie[getRandomInt(tie.length)];
                    storeActivePoll();
                    socket.emit('poll-results', activePoll);
                    setTimeout (() => {activePoll = null;}, 1500);
                }
                else {
                    activePoll.nominationsMap.sort(sortNominations);
                    activePoll.runoffPoll.sort(sortNominations);
                    activePoll.winner = topVote[0];
                    storeActivePoll();
                    socket.emit('poll-results', activePoll);
                    setTimeout (() => {activePoll = null;}, 1500);
                }
            }
        }
    })
})
