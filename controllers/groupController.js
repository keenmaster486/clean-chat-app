const express = require('express');
const router = express.Router();

const Group = require('../models/groupSchema');
const User = require('../models/userSchema');
const Message = require('../models/messageSchema');

router.get('/', function(req, res)
{
	console.log("GET /groups");
	
	//Return just an array of the names and IDs of the groups for now

	Group.find({}, function(err, foundGroups)
	{
		if (err) {console.log(err);}
		else
		{
			const infoToSend = foundGroups.map((group) =>
			{
				const singleGroupInfo =
				{
					name: group.name,
					id: group._id
				};
				return singleGroupInfo;
			});
			//Actually send the info now:
			res.json(infoToSend);
		}
	});
});

router.get('/:id', function(req, res)
{
	console.log(`GET /groups/${req.params.id}`);

	//Create an object that has info about the group, and then res.json it:
	//find the group and add the info to the object:
	Group.findById(req.params.id, function(err, foundGroup)
	{
		if (err) {console.log(err);}
		else
		{
			const groupInfo =
			{
				name: foundGroup.name,
				id: foundGroup._id,
				topic: foundGroup.topic,
				type: foundGroup.type,
				private: foundGroup.private,
				joinpolicy: foundGroup.joinpolicy,
				allowinvite: foundGroup.allowinvite,

				//extra info not directly in the group schema:
				msgLength: foundGroup.messages.length
			};
			res.json(groupInfo);
		}
	});
});


router.get('/:id/messages/:startmsg/:endmsg', function(req, res)
{
	//Returns messages from startmsg to endmsg

	console.log(`GET /groups/${req.params.id}/messages/${req.params.startmsg}/${req.params.endmsg}`);

	Group.findById(req.params.id)
	.populate('messages')
	.exec(function(err, foundGroup)
	{
		
		if (err) {console.log(err);}
		else
		{
			//we've found the group, now validate the endpoints:
			if (req.params.startmsg > foundGroup.messages.length || req.params.startmsg < 0 || req.params.endmsg < 0 || req.params.endmsg > foundGroup.messages.length)
			{
				res.json(
				{
					success: false
				});
			}
			else
			{
				//endpoints are good, now send the messages:
				console.log(foundGroup.messages);
				res.json(foundGroup.messages.slice(req.params.startmsg, req.params.endmsg));
			}
		}
	});
});


router.post('/:id/messages', function(req, res)
{
	//Add a message to the group's messages array!!

	console.log(`POST /groups/${req.params.id}/messages`);
	//Figure out which user is making the message:

	console.log(req.body);

	User.findById(req.body.userId, function(err, foundUser)
	{
		if (err) {console.log(err);}
		else
		{
			//Create the message:
			const newMsg =
			{
				userId: foundUser._id,
				userdisplayname: foundUser.displayname,
				text: req.body.text,
				image: req.body.image,
				video: req.body.video,
				url: req.body.url
			};
			Message.create(newMsg, function(err, createdMsg)
			{
				if (err)
				{
					console.log(err);
					res.json(
					{
						success: false
					});
				}
				else
				{
					Group.findByIdAndUpdate(req.params.id, {$push: {messages: createdMsg._id}}, function(err, updatedGroup)
					{
						if (err) {console.log(err);}
						res.json(
						{
							success: true,
							text: createdMsg.text,
							id: createdMsg._id
						});
					});
				}
			});
		}
	});

});


router.post('/', async function(req, res)
{
	console.log("POST /groups");

	//Create a new group

	//Construct the group object from req.body:

	//For now, the only user we add to the group will
	//be the current user.

	//In the body will be the id of the user who created the group!
	//(we will do this with a type="hidden" input tag in the form)
	//When I get the session working, here will be code to compare
	//this id with the id of the current user!

	const creatorUser = req.body.userId;			//await User.findById(req.body.userId);

	const newGroup =
	{
		users: [await creatorUser],
		admins: [await creatorUser],
		name: req.body.name,
		categories: [req.body.category],
		topic: req.body.topic,
		type: req.body.type,
		private: null,
		joinpolicy: parseInt(req.body.joinpolicy),
		allowinvite: null,
		messages: []
	};
	//==========================================
	if (req.body.private == 'on')
	{
		newGroup.private = true;
	}
	else
	{
		newGroup.private = false;
	}
	//==========================================
	if (req.body.allowinvite == 'on')
	{
		newGroup.allowinvite = true;
	}
	else
	{
		newGroup.allowinvite = false;
	}


	//OK we set up the newGroup object and we're ready!
	//Actually create the group now:

	Group.create(await newGroup, function(err, createdGroup)
	{
		if (err) 
		{
			console.log(err);
			res.json(
			{
				success: false
			});
		}
		else
		{
			console.log("successfully created a new group");
			console.log(createdGroup);
			res.json(
			{
				success: true,
				createdGroup: createdGroup
			});
		}
	});
});



router.get('/')


module.exports = router;