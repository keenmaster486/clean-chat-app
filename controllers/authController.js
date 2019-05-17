const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/userSchema');

router.get('/status', function(req, res)
{
	if (req.session.logged)
	{
		//res.redirect('/home')
		console.log("GET /auth/status");
		console.log(req.session);
		res.send("status: logged in");
	}
	else
	{
		//res.render('auth/login.ejs')
		console.log("GET /auth/status");
		console.log(req.session);
		res.send("status: not logged in");
	}
});

router.post('/login', function(req, res)
{
	//Change username to lowercase:
	req.body.username = req.body.username.toLowerCase();
	console.log(`POST /login: trying to login for ${req.body.username}`);
	//Find the user and take note of the password hash:
	User.findOne({username: req.body.username}, function(err, foundUser)
	{
		if (err) //If there was an error of some sort
		{
			console.log(err);
			//res.send("There was an error while logging in. Send this to the website developers: " + err);
			res.json({
				success: false
			});
		}
		else if (!foundUser) //User does not exist!
		{
			req.session.loginAttempt = false;
			//res.redirect('/auth/login')
			//res.send("user does not exist");
			res.json({
				success: false
			});
		}
		else //User DOES exist. Try the password now!!
		{
			//Compare password hash to entered password using bcrypt:
			console.log(`Comparing bcrypt password hash.....`);
			if (bcrypt.compareSync(req.body.password, foundUser.password))
			{
				//Passwords MATCH!
				req.session.username = req.body.username;
				req.session.logged = true;
				req.session.usertype = foundUser.usertype;
				console.log(`${req.body.username} login attempt: passwords match`);
				req.session.messages.userwelcome = `Welcome, ${req.session.username}!`;
				req.session.curuserid = foundUser._id;
				//res.redirect('/home');
				req.session.loginAttempt = true;
				console.log("login attempt successful");
				//res.send("login attempt successful");
				//console.log(req.session);

				//We'll go ahead and send the current user id to the client side:
				res.json({
					success: true,
					userId: foundUser._id
				});
			}
			else
			{
				//Passwords do NOT MATCH!
				req.session.loginAttempt = false;
				//res.redirect('/auth/login')
				//res.send("incorrect password");
				res.json({
					success: false
				});
			}
		}
	});
});



router.get('/logout', function(req, res)
{
	if (!req.session.username)
	{
		//res.redirect('/home')
		res.send("already logged out");
	}
	else
	{
		//END the session:
		const tempusername = req.session.username;
		req.session.logged = false;
		req.session.usertype = null;
		req.session.messages.userwelcome = "You are not logged in";
		req.session.curuserid = null;
		req.session.destroy();
		console.log(`${tempusername} is now logged out`);
		//res.redirect('/home')
		res.send("logged out");
	}
});

router.get('/delete', function(req, res)
{
	if (!req.session.username)
	{
		//res.redirect('/auth/login')
		res.send("not logged in, don't do this");
	}
	else
	{
		User.findOne({username: req.session.username}, function(err, foundUser)
		{
			//res.render('user/delete.ejs', {user: foundUser});
			res.send("use a DELETE request to delete a user");
		});
	}
});

router.delete('/delete', function(req, res)
{
	//delete the user!!

	//Perform some checks to make sure we want to do this:

	if (!req.session.username)
	{
		//res.redirect('/auth/login')
		res.send("not logged in, cannot delete user");
	}
	else //User is logged in
	{
		let userToDeleteId;
		User.findOne({username: req.session.username}, function(err, foundUser)
		{
			if (err) {console.log(err);}
			else
			{
				//Gotta make sure they entered their password in the confirmation form:
				if (bcrypt.compareSync(req.body.password, foundUser.password))
				{
					userToDeleteId = foundUser._id;
					User.findByIdAndDelete(foundUser._id, function(err, deletedUser)
					{
						req.session.destroy();
						//res.redirect('/home')
						res.send("deleted user successfully");
					});
				}
				else
				{
					console.log("Delete user failed; incorrect password!");
					res.send("Incorrect password - your user account was NOT deleted");
				}
			}
		});

	}
})


module.exports = router;