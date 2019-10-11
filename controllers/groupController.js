const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Group = require('../models/groupSchema');
const User = require('../models/userSchema');
const Message = require('../models/messageSchema');

router.get('/', function(req, res)
{
	console.log("GET /groups");
	
	//Return just an array of the names and IDs of the groups for now

	//OK, this returns only an array of the public groups!

	if (!req.session.logged)
	{
		//disallow!
		res.json(
		{
			success: false,
			message: "Log in to get the groups!"
		});
	}
	else
	{
		Group.find({}, function(err, foundGroups)
		{
			if (err) {console.log(err);}
			else
			{
				const infoToSend = [];
				//console.log(foundGroups);
				foundGroups.forEach((group, index) =>
				{
					if (!group.private)
					{
						//console.log("found a public group to send")
						const singleGroupInfo =
						{
							name: group.name,
							id: group._id
						};
						infoToSend.push(singleGroupInfo);
					}
				});
				//Actually send the info now:
				res.json(infoToSend);
			}
		});
	}
});

router.get('/foruser/:userId', function(req, res)
{
	console.log("GET /groups/foruser/" + req.params.userId);
	
	//Return just an array of the names and IDs of the groups for now

	if (req.session.curuserid != req.params.userId)
	{
		res.json(
		{
			success: false,
			message: "Log in first!"
		});
	}
	else
	{
		Group.find({}, function(err, foundGroups)
		{
			if (err) {console.log(err);}
			else
			{
				const infoToSend = [];

				for (let i = 0; i < foundGroups.length; i++)
				{
					console.log(foundGroups[i].users);
					if (foundGroups[i].users.includes(req.params.userId) && foundGroups[i].type != 'dm')
					{
						infoToSend.push(
						{
							name: foundGroups[i].name,
							id: foundGroups[i]._id,
							private: foundGroups[i].private
						});
					}
				}
				console.log(infoToSend);

				// const infoToSend = foundGroups.map((group) =>
				// {
				// 	const singleGroupInfo =
				// 	{
				// 		name: group.name,
				// 		id: group._id
				// 	};
				// 	return singleGroupInfo;
				// });
				//Actually send the info now:
				res.json(infoToSend);
			}
		});
	}
});

router.get('/:id', function(req, res)
{
	console.log(`GET /groups/${req.params.id}`);

	//Create an object that has info about the group, and then res.json it:
	//find the group and add the info to the object:


	if (!req.session.logged)
	{
		res.json(
		{
			success: false,
			message: "Log in first!"
		});
	}
	else
	{
		Group.findById(req.params.id, function(err, foundGroup)
		{
			if (err) {console.log(err);}
			else
			{
				const groupInfo =
				{
					name: foundGroup.name,
					id: foundGroup._id,
					categories: foundGroup.categories,
					topic: foundGroup.topic,
					type: foundGroup.type,
					private: foundGroup.private,
					joinpolicy: foundGroup.joinpolicy,
					allowinvite: foundGroup.allowinvite,

					//extra info not directly in the group schema:
					msgLength: foundGroup.messages.length
				};
				if (foundGroup.type == 'dm')
				{
					groupInfo.users = foundGroup.users;
				}
				res.json(groupInfo);
			}
		});
	}
});





router.get('/:id/users', function(req, res)
{
	console.log(`GET /groups/${req.params.id}/users`);

	//find the group and add the info to the object:


	if (!req.session.logged)
	{
		res.json(
		{
			success: false,
			message: "Log in first!"
		});
	}
	else
	{
		Group.findById(req.params.id).populate('users').exec(function(err, foundGroup)
		{
			if (err) {console.log(err);}
			else
			{
				const groupInfo =
				{
					users: foundGroup.users
				};
				
				res.json(groupInfo);
			}
		});
	}
});


router.get('/dms/:user1_id/:user2_id', (req, res) =>
{
	//Returns the group info for DMs for two users
	//Or creates it if it doesn't already exist and then returns the info

	console.log("Getting information for a DM group between two users");

	User.findById(req.params.user1_id, (err, foundUser1) =>
	{
		User.findById(req.params.user2_id, (err, foundUser2) =>
		{
			if (foundUser1 && foundUser2)
			{
				Group.findOne({users:{$all: [mongoose.Types.ObjectId(req.params.user1_id), mongoose.Types.ObjectId(req.params.user2_id)]}, type: 'dm'}, (err, foundGroup) =>
				{
					console.log("foundGroup:");
					console.log(foundGroup);
					if (!foundGroup)
					{
						//uh oh it doesn't exist, create it!
						//construct the object for the group:

						console.log("Users found but DM group not found");

						const newDmGroup =
						{
							users: [req.params.user1_id, req.params.user2_id],
							admins: [req.params.user1_id, req.params.user2_id],
							type: 'dm',
							name: 'DM between two users',
							categories: [],
							topic: 'dms',
							private: true,
							joinpolicy: 2,
							allowinvite: false
						};

						console.log("Creating new group:");
						console.log(newDmGroup);

						// res.json(
						// {
						// 	success: "true",
						// 	message: "Would create new group"
						// });

						Group.create(newDmGroup, (err, createdGroup) =>
						{
							if (err)
							{
								console.log(err);
							}
							else
							{
								if (createdGroup.users)
								{
									//it worked! Send the info:
									res.json(createdGroup);
								}
								else
								{
									//Uh oh something went wrong
									res.json(
									{
										success: false
									});
								}
							}
						});

						//Add the users to each others' contacts lists:

						foundUser1.contacts.push(
						{
							_id: foundUser2._id,
							username: foundUser2.username,
							displayname: foundUser2.displayname
						});
						foundUser2.contacts.push(
						{
							_id: foundUser1._id,
							username: foundUser1.username,
							displayname: foundUser1.displayname
						});
						foundUser1.save();
						foundUser2.save();
					}
					else
					{
						//it does exist! Send the info:
						console.log("The DM group exists!");
						res.json(foundGroup);
					}
				});
			}
			else
			{
				console.log("One or both of those users doesn't exist")
				res.json(
				{
					success: false,
					message: "One or both of those users does not exist"
				});
			}
		});
	})

	
});



router.get('/:id/messages/:startmsg/:endmsg', function(req, res)
{
	//Returns messages from startmsg to endmsg

	console.log(`GET /groups/${req.params.id}/messages/${req.params.startmsg}/${req.params.endmsg}`);

	if (!req.session.logged)
	{
		res.json(
		{
			success: false,
			message: "Log in first!"
		});
	}
	else
	{
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
	}
});


router.post('/:id/messages', function(req, res)
{
	//Add a message to the group's messages array!!

	console.log(`POST /groups/${req.params.id}/messages`);
	//Figure out which user is making the message:

	console.log(req.body);

	if (!req.session.logged || req.session.curuserid != req.body.userId)
	{
		req.json(
		{
			success: false,
			message: "Permission denied!"
		});
	}
	else
	{
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
	}

});





router.put('/:id/messages', function(req, res)
{
	//Edit a message!!

	console.log(`PUT /groups/${req.params.id}/messages`);
	//Figure out which user is making the message:

	console.log(req.body);

	if (!req.session.logged || req.session.curuserid != req.body.userId)
	{
		req.json(
		{
			success: false,
			message: "Permission denied!"
		});
	}
	else
	{
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
				Message.findByIdAndUpdate(req.body.id, newMsg, function(err, updatedMsg)
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
						res.json(
						{
							success: true,
							text: updatedMsg.text,
							id: updatedMsg._id
						});
					}
				});
			}
		});
	}
});



router.delete('/:id/messages', function(req, res)
{
	//Delete a message

	console.log(`DELETE /groups/${req.params.id}/messages`);
	//Figure out which user is making the message:

	console.log(req.body);

	if (!req.session.logged || req.session.curuserid != req.body.userId)
	{
		res.json(
		{
			success: false,
			message: "Permission denied!"
		});
	}
	else
	{
		User.findById(req.body.userId, function(err, foundUser)
		{
			if (err) {console.log(err);}
			else
			{
				Message.findByIdAndDelete(req.body.id, function(err, deletedMsg)
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
						
						Group.findById(req.params.id, function(err, foundGroup)
						{
							if (err) {console.log(err);}
							else
							{
								//Remove the reference to the message
								//from the messages array in the group:
								
								for (let i = 0; i < foundGroup.messages.length; i++)
								{
									if (foundGroup.messages[i] == req.body.id)
									{
										foundGroup.messages.splice(i, 1); //remove it
										console.log("removed a message");
										break;
									}
								};

								foundGroup.save();

								res.json(
								{
									success: true,
								});
							}
						});
					}
				});
			}
		});
	}
});


router.put('/:id/adduser', function(req, res)
{
	console.log(`PUT /groups/${req.params.id}/adduser`);

	//Add a user to the group

	if (!req.session.logged)
	{
		res.json(
		{
			success: false,
			message: "Log in first!"
		});
	}
	else
	{
		Group.findById(req.params.id, function(err, foundGroup)
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
				//add the user, but first make sure that user actually exists:
				console.log("trying to find user");
				User.findById(req.body.userId, function(err, foundUser)
				{
					if (err)
					{
						console.log(err);
						res.json(
						{
							success: false,
							message: "Unknown error"
						});
					}
					else
					{
						console.log(`Adding user ${foundUser.userdisplayname} to the group ${foundGroup.name}`);
						if (foundGroup.users.includes(foundUser._id))
						{
							//oops, user is already in the group
							res.json(
							{
								success: false,
								message: "User already in group!"
							});
						}
						else
						{
							foundGroup.users.push(foundUser);
							foundGroup.save();
							res.json(
							{
								success: true,
								message: "User added to group"
							});
						}
					}
				});
			}
		});
	}
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

	if (!req.session.logged)
	{
		res.json(
		{
			success: false,
			message: "Log in first!"
		});
	}
	else
	{
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
	}
});






module.exports = router;