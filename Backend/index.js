import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://movie-and-game-nights.web.app/Home/home.html"
  }
});

const homeNamespace = io.of('/home');
const recommendNamespace = io.of('/recommend');

var activePoll = null; 

homeNamespace.on('connection', socket => {
    console.log("homepage connected");
    if(activePoll != null) {
        if(activePoll.activity == 'movie') {
            socket.emit('new-movie-poll', activePoll)
        }
        else if(activePoll.activity == 'game') {
            socket.emit('new-game-poll', activePoll)
        }
    }
    socket.on('create-movie-poll', data => {
        var votesMap = new Map();
        activePoll = {
            activity: 'movie',
            maxVotes: data.numVoters,
            totalVotes: 0,
            nominations: votesMap
        };
        homeNamespace.emit('new-movie-poll', activePoll);
    });
    socket.on('create-game-poll', data => {
        var votesMap = new Map();
        data.nominations.forEach(name => {
            votesMap.set(name, 0);
        });
        activePoll = {
            activity: 'game',
            maxVotes: data.numVoters,
            totalVotes: 0,
            nominations: votesMap
        }
    })
    socket.on('add-movie', data => {
        activePoll.votesMap.set(data, 0);
        homeNamespace.emit('new-nomination', activePoll);
        socket.emit('add-movie-response', "OK");
    });

})
