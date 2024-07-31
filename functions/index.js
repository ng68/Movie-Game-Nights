const {initializeApp} = require("firebase-admin/app");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");

const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.checkUser = onCall((request) => {
    return new Promise(function(resolve) {
        const uid = request.data.uid;
        const email = request.data.email;
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