console.log("server.js is loaded");

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const mongoose = require('mongoose');
const path=require('path');

require('dotenv').config();

//const http = require('http').Server(app);

const socketIo = require('socket.io');

const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const groupController = require('./controllers/groupController');

require('./db/db');

let port = process.env.PORT;
if (!port) {port = 9000;}




app.use(cors(
{
	origin: process.env.REACT_ADDRESS,
	optionsSuccessStatus: 200,
	credentials: true
}));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/static', express.static(path.join(__dirname, '/react-frontend/build')));



app.use(session(
{
	//TODO: what should this secret string be?
	secret: "avmjlajurialajfrlirjalifjsadligjliajalerjalkejfidsjvlzkcxjvlaisjdifjsaf",
	resave: false, //only save if there has been a change
	saveUninitialized: false, //only save if we have mutated the session - this is what should be done for logins
	logged: false,
}));



//The following function acts as middleware on ALL requests,
//and is intended to monitor the session object in order
//to make sure it's being made available to the ejs views,
//and also to make sure the user login information is being
//kept up to date!
app.use(function(req, res, next)
{
	if (req.session.loginAttempt){
		req.session.loginmessage = null
	} else {
		req.session.loginmessage = "Incorrect Username or Password"
	}
	if (!req.session.logged)
	{
		req.session.messages =
		{
			userwelcome: "You are not logged in"
		}
		req.session.curuserid = null;
		req.session.username = null;
		req.session.usertype = null;
	}
	res.locals.session = req.session;
	next();
});




app.use('/users', userController);
app.use('/auth', authController);
app.use('/groups', groupController);









app.get('/status', function(req, res)
{
	res.json(
	{
		text: 'Express API online'
	});
});


app.post('/status', function(req, res)
{
	console.log('POST /status');
	console.log(req.body);
	res.json(req.body);
});



// app.get('*', function(req, res)
// {
// 	//SEND REACT STUFF
// 	res.sendFile(path.join(__dirname+'/react-frontend/build/index.html'));
// });



const server = app.listen(port, function(err)
{
	if (err)
	{
		console.log(err);
	}
	else
	{
		console.log(`Server is listening on port ${port}`);
	}
});








//----SOCKET.IO STUFF----

const io = socketIo(server);


io.on('connection', function(socket)
{
	console.log('socket.io: connection detected');
	socket.on('disconnect', function()
	{
		console.log('socket.io: disconnect detected');
	});
});



//socket.io
//io.emit('event name', {data: data})  //to everone
//io.to('roomname').emit('event name', {data: data})  //to only one room
//socket.emit('event name', {data: data}) //to only one socket connection

