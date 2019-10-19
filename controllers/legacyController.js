const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');


const Group = require('../models/groupSchema');
const User = require('../models/userSchema');
const Message = require('../models/messageSchema');

router.get('/', (req, res) =>
{
	res.send("OK ");
});

router.get('/groups/public', (req, res)=>
{
	if (!req.session.logged)
	{
		res.send("Log in first ");
	}
	else
	{
		Group.find({type: 'public'}, (err, foundGroups)=>
		{
			if (err)
			{
				console.log(err);
			}
			else
			{
				let response = "";
				for (let i = 0; i < foundGroups.length; i++)
				{
					response += foundGroups[i].name + "|" + foundGroups[i]._id + "|";	
				}
				response += " ";
				res.send(response);
			}
		});
	}
});

router.get('/groups/private', (req, res)=>
{
	if (!req.session.logged)
	{
		res.send("Log in first ");
	}
	else
	{
		Group.find({type: 'private', users: mongoose.Types.ObjectId(req.session.curuserid)}, (err, foundGroups)=>
		{
			if (err)
			{
				console.log(err);
			}
			else
			{
				let response = "";
				for (let i = 0; i < foundGroups.length; i++)
				{
					response += foundGroups[i].name + "|" + foundGroups[i]._id + "|";	
				}
				response += " ";
				res.send(response);
			}
		});
	}
});

router.get('/groups/dms', (req, res)=>
{
	//get the dms

	if (!req.session.logged)
	{
		res.send("Log in first ");
	}
	else
	{
		Group.find({type: 'dm', users: mongoose.Types.ObjectId(req.session.curuserid)}).populate('users').exec((err, foundGroups)=>
		{
			if (err)
			{
				console.log(err);
			}
			else
			{
				let response = "";
				for (let i = 0; i < foundGroups.length; i++)
				{
					if (foundGroups[i].users[0]._id == req.session.curuserid)
					{
						response += foundGroups[i].users[1].displayname + "|" + foundGroups[i]._id + "|";
					}
					else
					{
						response += foundGroups[i].users[0].displayname + "|" + foundGroups[i]._id + "|";
					}
				}
				response += " ";
				res.send(response);
			}
		});
	}
});



router.get('/groups/:id/messages', (req,res)=>
{
	if (!req.session.logged)
	{
		res.send("Log in first");
	}
	else
	{
		Group.findById(req.params.id).populate('messages').exec((err, foundGroup)=>
		{
			if (err)
			{
				console.log(err);
				res.send("Error");
			}
			else
			{
				let response = "";
				for (let i = 0; i < foundGroup.messages.length; i++)
				{
					response += foundGroup.messages[i].userdisplayname + ": " + foundGroup.messages[i].text + "\n\n";
				}
				if (foundGroup.messages.length == 0)
				{
					response += "No messages yet";
				}
				response += " ";
				res.send(response);
			}
		});
	}
});

router.get('/groups/:id/messageslength', (req,res)=>
{
	if (!req.session.logged)
	{
		res.send("Log in first");
	}
	else
	{
		Group.findById(req.params.id).populate('messages').exec((err, foundGroup)=>
		{
			if (err)
			{
				console.log(err);
				res.send("Error");
			}
			else
			{
				let response = "";
				response += foundGroup.messages.length;
				response += " ";
				res.send(response);
			}
		});
	}
});


module.exports = router;