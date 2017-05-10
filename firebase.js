
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

var firebase = require('firebase');
firebase.initializeApp({
	databaseURL:"https://###########.com/",
	serviceAccount: path.join(process.cwd(),"firebase-key.json"),
	databaseAuthVariableOverride: {
		uid:####,
	}

});

var db = firebase.database();
var unique_id = function () {
	var c = "";
	var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var b = "abcdestw0123456789";
	c += a.charAt(Math.floor(Math.random() * a.length));
	for (var i = 0; i < 20; i++)
		c += b.charAt(Math.floor(Math.random() * b.length));
	return (c);
};
app.use('/firebase_data', function (req, res) {
	console.log("hello firebase");
	console.log("req is",req.body);
	savedata(req.body.endpoint,req.body.authkey,req.body.p256dh);
	res.status(200);
	res.json({
			success: "data updated successfully"
	});
	
});
app.post('/check',function(req, res){
	console.log("hello world");
});
function savedata(endpoint,authKey,p256dh){
	console.log("inside savedata");
	var user_ref=db.ref("User-id");
		user_ref.child(unique_id()).set({
			"endpoint":endpoint,
			"authKey":authKey,
			"p256dh":p256dh
	});
};



var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log(" app listening at http://%s:%s", host, port);
});
