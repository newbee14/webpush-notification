'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const path = require('path');
const app = express();
const firebase = require('firebase');
firebase.initializeApp({
	databaseURL:"https://###########.com/",
	serviceAccount: path.join(process.cwd(),"firebase-key.json"),
	databaseAuthVariableOverride: {
		uid:####,
	}

});

// Parse JSON body
app.use(bodyParser.json());

var db = firebase.database();
var ref = db.ref("User-id");

var tempFirebaseArray = new Array();
var firebase_keyArray = new Array();
app.post('/send-push-msg', (req, res) => {
	ref.once("value", function (snapshot) {
		var firebase_data = snapshot.val();
		if(firebase_data !=null){
			for (var keys in firebase_data) {
				if (firebase_data.hasOwnProperty(keys)) {
					for (var key in firebase_data[keys]) {
						if (firebase_data[keys].hasOwnProperty(key)) {
							tempFirebaseArray.push(firebase_data[keys][key]);
						}
					}
					//console.log("hello world");
					const options = {
						vapidDetails: {
							subject: 'https://google.com',
							publicKey:  "",
							privateKey: "" 
						},
						// 1 hour in seconds, by default its 4 weeks
						//TTL: 60 * 60
						/*headers:{
									//pass on additional headers
									key:value
	  							}*/
					};
					//console.log(typeof (tempFirebaseArray[0]));
					var subscription={
						"endpoint":tempFirebaseArray[1],
						"keys":{
							"auth":tempFirebaseArray[0],
							"p256dh":tempFirebaseArray[2]
						}
					}
					//console.log(subscription);
					//console.log(ola);
					var data=JSON.stringify(req.body.data);
					function sendPush(callback){
						webpush.sendNotification(
							subscription,
							data,
							options
						)
							.then(() => {
							res.status(200).send({success: true});
							callback;
						})
							.catch((err) => {
							if (err.statusCode) {
								res.status(err.statusCode).send(err.body);
							} else {
								res.status(400).send(err.message);
							}
							callback;
						});
					}

					function clearArray(){
						tempFirebaseArray=[];
					}
					sendPush(clearArray);
					//console.log("array is",tempFirebaseArray);
				}
			}
		}
	})

});

app.use('/', express.static('static'));

// Start the server
const server = app.listen('8085', () => {
	console.log('App listening on port %s', server.address().port);
	console.log('Press Ctrl+C to quit.');
});