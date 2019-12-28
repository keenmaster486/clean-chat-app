const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const cloudinary = require('cloudinary').v2;

cloudinary.config(
{
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

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
						//get the user metadata:
						let userMetaData =
						{
							lastMsgLength: null //never opened group is default
						};
						if (group.usersMetaData)
						{
							// for (let i = 0; i < group.usersMetaData.length; i++)
							// {
							// 	if (group.usersMetaData[i].userId == req.session.curuserid)
							// 	{
							// 		userMetaData = group.usersMetaData[i];
							// 	}
							// }
							if (group.usersMetaData.get(req.session.curuserid))
							{
								userMetaData = group.usersMetaData.get(req.session.curuserid);
							}
						}
						const singleGroupInfo =
						{
							name: group.name,
							id: group._id,
							userMetaData: userMetaData
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
						//get the user metadata:
						let userMetaData =
						{
							lastMsgLength: null //never opened group is default
						};
						if (foundGroups[i].usersMetaData)
						{
							// for (let j = 0; j < foundGroups[i].usersMetaData.length; j++)
							// {
							// 	if (foundGroups[i].usersMetaData[j].userId == req.session.curuserid)
							// 	{
							// 		userMetaData = foundGroups[i].usersMetaData[j];
							// 	}
							// }
							if (foundGroups[i].usersMetaData.get(req.session.curuserid))
							{
								userMetaData = foundGroups[i].usersMetaData.get(req.session.curuserid);
							}
						}
						infoToSend.push(
						{
							name: foundGroups[i].name,
							id: foundGroups[i]._id,
							private: foundGroups[i].private,
							userMetaData: userMetaData
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
				
				//get the user metadata:
				let userMetaData =
				{
					lastMsgLength: null //never opened group is default
				};
				if (foundGroup.usersMetaData)
				{
					// for (let i = 0; i < foundGroup.usersMetaData.length; i++)
					// {
					// 	if (foundGroup.usersMetaData[i].userId == req.session.curuserid)
					// 	{
					// 		userMetaData = foundGroup.usersMetaData[i];
					// 	}
					// }
					if (foundGroup.usersMetaData.get(req.session.curuserid))
					{
						userMetaData = foundGroup.usersMetaData.get(req.session.curuserid);
					}
				}
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
					msgLength: foundGroup.messages.length,
					userMetaData: userMetaData
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

						//Add the users to each others' contacts lists if they're not already there:

						if (!foundUser1.contacts.includes({
							_id: foundUser2._id,
							username: foundUser2.username,
							displayname: foundUser2.displayname
						}))
						{
							foundUser1.contacts.push(
							{
								_id: foundUser2._id,
								username: foundUser2.username,
								displayname: foundUser2.displayname
							});
						}
						if (!foundUser2.contacts.includes({
							_id: foundUser1._id,
							username: foundUser1.username,
							displayname: foundUser1.displayname
						}))
						{
							foundUser2.contacts.push(
							{
								_id: foundUser1._id,
								username: foundUser1.username,
								displayname: foundUser1.displayname
							});
						}
						foundUser1.save();
						foundUser2.save();
					}
					else
					{
						//it does exist! Send the info:
						console.log("The DM group exists!");
						//get the user metadata:
						let userMetaData =
						{
							lastMsgLength: -1 //never opened group is default
						};
						if (foundGroup.usersMetaData)
						{
							// for (let i = 0; i < foundGroup.usersMetaData.length; i++)
							// {
							// 	if (foundGroup.usersMetaData[i].userId == req.session.curuserid)
							// 	{
							// 		userMetaData = foundGroup.usersMetaData[i];
							// 	}
							// }
							if (foundGroup.usersMetaData.get(req.session.curuserid))
							{
								userMetaData = foundGroup.usersMetaData.get(req.session.curuserid);
							}
						}
						const infoToSend =
						{
							_id: foundGroup._id,
							users: foundGroup.users,
							name: foundGroup.name,
							type: foundGroup.type,
							private: foundGroup.private,
							userMetaData: userMetaData,
							msgLength: foundGroup.messages.length
						};
						console.log(infoToSend);
						res.json(infoToSend);
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
					//console.log(foundGroup.messages);
					//set the user metadata:
					if (foundGroup.usersMetaData)
					{
						// let foundUserMetaData = false;
						// for (let i = 0; i < foundGroup.usersMetaData; i++)
						// {
						// 	if (foundGroup.usersMetaData[i].userId == req.session.curuserid)
						// 	{
						// 		foundGroup.usersMetaData[i].lastMsgLength = foundGroup.messages.length;
						// 		foundGroup.usersMetaData[i].whetherChanged = false;
						// 		foundUserMetaData = true;
						// 	}
						// }
						// if (!foundUserMetaData)
						// {
						// 	foundGroup.usersMetaData.push(
						// 	{
						// 		userId: req.session.curuserid,
						// 		lastMsgLength: foundGroup.messages.length,
						// 		whetherChanged: false
						// 	});
						// }
						console.log(foundGroup.usersMetaData);
						const userMetaData = foundGroup.usersMetaData.get(req.session.curuserid);
						if (userMetaData)
						{
							//foundGroup.usersMetaData[req.session.curuserid].lastMsgLength = foundGroup.messages.length;
							//foundGroup.usersMetaData[req.session.curuserid].whetherChanged = false;
							userMetaData.lastMsgLength = foundGroup.messages.length;
							userMetaData.whetherChanged = false;
							foundGroup.usersMetaData.set(req.session.curuserid, userMetaData);
						}
						else
						{
							foundGroup.usersMetaData.set(req.session.curuserid,
							{
								lastMsgLength: foundGroup.messages.length,
								whetherChanged: false
							});
						}
						console.log(foundGroup.usersMetaData);
					}
					else
					{
						// foundGroup.usersMetaData = [
						// {
						// 	userId: req.session.curuserid,
						// 	lastMsgLength: foundGroup.messages.length,
						// 	whetherChanged: false
						// }]

						foundGroup.usersMetaData = new Map();
						foundGroup.usersMetaData.set(req.session.curuserid,
						{
							lastMsgLength: foundGroup.messages.length,
							whetherChanged: false
						});
					}
					foundGroup.save();
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
							else
							{
								//Set the user metadata:
								if (updatedGroup.usersMetaData)
								{
									// for (let i = 0; i < updatedGroup.usersMetaData.length; i++)
									// {
									// 	updatedGroup.usersMetaData[i].whetherChanged = true;
									// }
									for (let [key, value] of updatedGroup.usersMetaData)
									{
										value.whetherChanged = true;
										updatedGroup.usersMetaData.set(key, value);
									}
									// const userMetaData = updatedGroup.usersMetaData.get(req.session.curuserid);
									// if (userMetaData)
									// {
									// 	userMetaData.whetherChanged = true;
									// 	//updatedGroup.usersMetaData[req.session.curuserid].whetherChanged = true;
									// 	updatedGroup.usersMetaData.set(req.session.curuserid, userMetaData);
									// }
								}
								updatedGroup.save();
								if (req.body.retro)
								{
									res.redirect('/retroWeb/messages/' + req.params.id);
								}
								else
								{
									res.json(
									{
										success: true,
										text: createdMsg.text,
										id: createdMsg._id
									});
								}
							}
						});
					}
				});
			}
		});
	}

});

router.post('/:id/notify', (req, res) =>
{
	//flip the whetherChanged flag for all users!

	Group.findById(req.params.id, (err, foundGroup) =>
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			if (foundGroup.usersMetaData)
			{
				// for (let i = 0; i < foundGroup.usersMetaData.length; i++)
				// {
				// 	foundGroup.usersMetaData[i].whetherChanged = true;
				// }
				for (let [key, value] of foundGroup.usersMetaData)
				{
					value.whetherChanged = true;
					foundGroup.usersMetaData.set(key, value);
				}
				// const userMetaData = foundGroup.usersMetaData.get(req.session.curuserid);
				// if (userMetaData)
				// {
				// 	//foundGroup.usersMetaData[req.session.curuserid].whetherChanged = true;
				// 	userMetaData.whetherChanged = true;
				// 	foundGroup.usersMetaData.set(req.session.curuserid, userMetaData);
				// 	
				// }
			}
			foundGroup.save();
			console.log("==============NOTIFY ROUTE HIT===============");
			res.send(''); //send an empty string
		}
	});
});


router.post('/:id/messages/uploadImage', (req, res) =>
{
	console.log(`POST /groups/${req.params.id}/messages/uploadImage`);

	
	//The image will be coming through as a chunk of base64 data,
	//in req.body.image.


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
				//Create the message:
				const newMsg =
				{
					userId: foundUser._id,
					userdisplayname: foundUser.displayname,
					text: req.body.text,
					image: 'loading',
					video: '',
					url: ''
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
							if (req.body.retro)
							{
								res.redirect('/retroWeb/messages/' + req.params.id);
							}
							else
							{
								//Set the user metadata:
								if (updatedGroup.usersMetaData)
								{
									// for (let i = 0; i < updatedGroup.usersMetaData.length; i++)
									// {
									// 	updatedGroup.usersMetaData[i].whetherChanged = true;
									// }

									for (let [key, value] of updatedGroup.usersMetaData)
									{
										value.whetherChanged = true;
										updatedGroup.usersMetaData.set(key, value);
									}
									// const userMetaData = updatedGroup.usersMetaData.get(req.session.curuserid);
									// if (userMetaData)
									// {
									// 	//updatedGroup.usersMetaData[req.session.curuserid].whetherChanged = true;
									// 	userMetaData.whetherChanged = true;
									// 	updatedGroup.usersMetaData.set(req.session.curuserid, userMetaData);
									// }
								}
								updatedGroup.save();

								//Here we actually perform the image upload

								//We limit the image to 1024-height
								//and create an pre-stored transformation
								//that is a smaller size for old systems.

								const imageOptions =
								{
									height: 1024,
									crop: 'fit',
									format: 'jpg',
									eager: [{height: 480, crop: 'fit', format: 'jpg'}],
									notification_url: process.env.REACT_APP_BACKEND_ADDRESS + "/groups/" + updatedGroup._id + "/notify"
								}

								cloudinary.uploader.upload(req.body.image, imageOptions, function (err, response)
								{
									//Set the public id:
									createdMsg.image = cloudinary.url(response.public_id + '.jpg');
									createdMsg.save();
								});

								res.json(
								{
									success: true,
									text: createdMsg.text,
									id: createdMsg._id
								});
							}
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
						Group.findById(req.params.id, (err, foundGroup) =>
						{
							//Set the user metadata:
							if (foundGroup.usersMetaData)
							{
								// for (let i = 0; i < foundGroup.usersMetaData.length; i++)
								// {
								// 	foundGroup.usersMetaData[i].whetherChanged = true;
								// }
								for (let [key, value] of foundGroup.usersMetaData)
								{
									value.whetherChanged = true;
									foundGroup.usersMetaData.set(key, value);
								}
								// const userMetaData = foundGroup.usersMetaData.get(req.session.curuserid);
								// if (userMetaData)
								// {
								// 	//foundGroup.usersMetaData[req.session.curuserid].whetherChanged = true;
								// 	userMetaData.whetherChanged = true;
								// 	foundGroup.usersMetaData.set(req.session.curuserid, userMetaData);
								// }
							}
							foundGroup.save();
						});
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
										//Set the user metadata:
										if (foundGroup.usersMetaData)
										{
											// for (let i = 0; i < foundGroup.usersMetaData.length; i++)
											// {
											// 	foundGroup.usersMetaData[i].whetherChanged = true;
											// }
											for (let [key, value] of foundGroup.usersMetaData)
											{
												value.whetherChanged = true;
												foundGroup.usersMetaData.set(key, value);
											}
											// const userMetaData = foundGroup.usersMetaData.get(req.session.curuserid);
											// if (userMetaData)
											// {
											// 	//foundGroup.usersMetaData[req.session.curuserid].whetherChanged = true;
											// 	userMetaData.whetherChanged = true;
											// 	foundGroup.usersMetaData.set(req.session.curuserid, userMetaData);
											// }
										}
										console.log("removed a message");
										break;
									}
								};

								foundGroup.save();
								if (req.body.retro == 'true')
								{
									res.redirect('/retroWeb/messages/' + req.params.id);
								}
								else
								{
									res.json(
									{
										success: true,
									});
								}
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