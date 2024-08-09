const {initializeApp} = require("firebase-admin/app");
const {onCall, HttpsError, onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");

const {getFirestore, setDoc} = require("firebase-admin/firestore");

initializeApp();

exports.checkUser = onCall((request) => {
    return new Promise(function(resolve) {
        const uid = request.auth.uid;
        const email = request.auth.token.email;
        getFirestore().collection('members').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                logger.log("Doc Data: " + doc.data().uid + " " + doc.data().email)
                if (uid == doc.data().uid && email == doc.data().email) {
                    logger.log("Member Match Found!");
                    resolve({isMember: true})
                }
            });
            resolve({isMember: false});
        })
    })
});

exports.storePoll = onRequest({ cors: "https://movie-game-nights.onrender.com" },
    (req, res) => {
        const poll = req.body;
        var nominations = [];
        poll.nominationsMap.forEach(nomination => {
            nominations.push(nomination[0]);
        })
        if (poll.activity == 'Movie') {
            getFirestore().collection('movie-history').set({date: poll.date, nominations: nominations, voters: poll.maxVotes, winner: poll.winner}).then(() => {
                console.log("Movie Poll document successfully written!");
                res.status(201).send("Store Poll Success"); 
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
                res.status(500).send(error);
            });
            
        }
        else if (poll.activity == 'Game') {
            getFirestore().collection('game-history').set({date: poll.date, nominations: nominations, voters: poll.maxVotes, top3: poll.top3}).then(() => {
                console.log("Game poll document successfully written!");
                res.status(200).send("Store Poll Success");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
                res.status(500).send(error);
            });
            
        }
    }
);

exports.submitRecommendation = onCall((req, res) => {
    const rec = req.body;
    getFirestore().collection('recommendations').set(req).then(() => {
        console.log("Recommendation document successfully written!");
        res.status(200).send("Store Poll Success");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        res.status(500).send(error);
    });
});

exports.getMovieHistory = onCall((request) => {
    return new Promise(function(resolve) {
        var pollList = []
        getFirestore().collection('movie-history').orderBy('date').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                pollList.push(doc.data())
            });
            resolve({pollList: pollList});
        })
    })
});

exports.getGameHistory = onCall((request) => {
    return new Promise(function(resolve) {
        var pollList = []
        getFirestore().collection('game-history').orderBy('date').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                pollList.push(doc.data())
            });
            resolve({pollList: pollList});
        })
    })
});