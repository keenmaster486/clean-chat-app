console.log("server.js is loaded");

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const mongoose = require('mongoose');

const mongoStore = require('connect-mongo')(session);

const path=require('path');

require('dotenv').config();

//const http = require('http').Server(app);

const socketIo = require('socket.io');

const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const groupController = require('./controllers/groupController');
const legacyController = require('./controllers/legacyController');
const retroWebController = require('./controllers/retroWebController');

const dbConnection = require('./db/db');

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



app.use(express.static('./public'));

const sessionStore = new mongoStore(
{
	mongooseConnection: dbConnection,
	secret: process.env.STORE_SECRET
});

//console.log(sessionStore);


app.use(session(
{
	//TODO: what should this secret string be?
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false, //only save if there has been a change
	saveUninitialized: false, //only save if we have mutated the session - this is what should be done for logins
	logged: false,
	cookie: {httpOnly: false},
	unset: 'keep'
}));



//The following function acts as middleware on ALL requests,
//and is intended to monitor the session object in order
//to make sure it's being made available to the ejs views,
//and also to make sure the user login information is being
//kept up to date!
app.use(function(req, res, next)
{
	//console.log(req.headers);
	if (req.headers.authentication)
	{
		sessionStore.get(req.headers.authentication, (err, foundSession) =>
		{
			if (err)
			{
				console.log(err);
			}
			else
			{
				console.log("Authenticated Request");
				//console.log(foundSession);
				req.session.logged = foundSession.logged;
				req.session.curuserid = foundSession.curuserid;
				req.session.username = foundSession.username;
				req.session.usertype = foundSession.usertype;
				next();
			}
		});
	}
	else
	{
		console.log("UNAUTHENTICATED REQUEST")
		if (req.session.logged)
		{
			console.log("But from retro client so it's OK");
		}
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
			req.session.retroAutoReload = false;
		}
		res.locals.session = req.session;
		next();
	}
});




app.use('/users', userController);
app.use('/auth', authController);
app.use('/groups', groupController);
app.use('/legacy', legacyController);
app.use('/retroWeb', retroWebController);


app.get('/', (req, res)=>
{
	res.render('index.ejs');
});






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



app.use(express.static(path.join(__dirname, '/react-frontend/build')));

app.get('/react', function(req, res)
{
	//SEND REACT STUFF
	res.sendFile(path.join(__dirname+'/react-frontend/build/index.html'));
});





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

