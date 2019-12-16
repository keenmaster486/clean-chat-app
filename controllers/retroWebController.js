const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const cloudinary = require('cloudinary').v2;

const Group = require('../models/groupSchema');
const User = require('../models/userSchema');
const Message = require('../models/messageSchema');


//This is the controller for the retro web client, which is
//a legacy javascript app that provides an interface that
//old browsers can use, such as Netscape Navigator.

//Target systems should be 386/486, Windows 3.1, Netscape Navigator 3.0 or IE 3.0

//We'll use techniques like frames and forms to make it work instead
//of javascript fetch requests.


router.get('/', async (req, res)=>
{
	//Homepage for retro web client
	res.render('retroWeb/home.ejs');

	//index.ejs either makes you log in, or shows you the list of
	//groups/DMs you can enter.
});

router.get('/selectgroup', async (req, res)=>
{
	//Homepage for retro web client
	if (req.session.logged)
	{
		let publicGroups = await Group.find({private: false});
		let privateGroups = await Group.find({private: true, type: 'std', users: {$in: [mongoose.Types.ObjectId(req.session.curuserid)]}});
		let currentUser = await User.findById(req.session.curuserid).populate('contacts');
		let contacts = await currentUser.contacts;
		res.render('retroWeb/selectgroup.ejs', {publicGroups: await publicGroups, privateGroups: await privateGroups, contacts: await contacts});
	}
	else
	{
		//do nothing? We shouldn't be here
	}
});

router.get('/chatbox', (req, res)=>
{
	if (req.session.logged)
	{
		res.render('retroWeb/chatbox.ejs', {group: null});
	}
});

router.get('/chatbox/:whichGroup', async (req, res)=>
{
	if (req.session.logged)
	{
		if (req.params.whichGroup)
		{
			let groupToEnter = await Group.findById(req.params.whichGroup);
			res.render('retroWeb/chatbox.ejs', {group: await groupToEnter})
		}
		else
		{
			res.render('retroWeb/chatbox.ejs', {group: null})
		}
	}
});

router.post('/chatbox', (req, res)=>
{
	if (req.session.logged)
	{
		if (req.body.whichGroup)
		{
			//let groupToEnter = await Group.findById(req.body.whichGroup);
			//res.render('retroWeb/chatbox.ejs', {group: await groupToEnter})
			if (req.body.whetherDm == 'true')
			{
				let whichGroup = '';
				//figure out which one we need:







				//Yes it's bad but this is copy-pasted from groupController.js



				console.log("Getting information for a DM group between two users");

				User.findById(req.session.curuserid, (err, foundUser1) =>
				{
					User.findById(req.body.whichGroup, (err, foundUser2) =>
					{
						if (foundUser1 && foundUser2)
						{
							Group.findOne({users:{$all: [mongoose.Types.ObjectId(req.session.curuserid), mongoose.Types.ObjectId(req.body.whichGroup)]}, type: 'dm'}, (err, foundGroup) =>
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
												//res.json(createdGroup);
												res.redirect('/retroWeb/chatbox/' + createdGroup._id);
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
									//res.json(foundGroup);
									res.redirect('/retroWeb/chatbox/' + foundGroup._id);
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







				//res.redirect('/retroWeb/chatbox/' + whichGroup);
			}
			else //if NOT a dm, just a normal group:
			{
				res.redirect('/retroWeb/chatbox/' + req.body.whichGroup);
			}
		}
		else
		{
			res.render('retroWeb/chatbox.ejs', {group: null});
		}
	}
});

router.get('/messages/:id', (req, res)=>
{
	if (req.session.logged)
	{
		Group.findById(req.params.id).populate('messages').exec((err, foundGroup)=>
		{
			let messages = foundGroup.messages;
			for (let i = 0; i < messages.length; i++)
			{
				console.log(messages[i].image);
				if (messages[i].image && messages[i].image != '')
				{
					if (messages[i].image.includes('cloudinary'))
					{
						//get the id from the url:
						let id;
						for (let j = messages[i].image.length; j > 0; j--)
						{
							if (messages[i].image[j] == '/')
							{
								//we've found the slash
								id = messages[i].image.substr(j + 1, messages[i].image.length - j - 5);
								break;
							}
						}
						console.log("id");
						console.log(id);
						messages[i].image = cloudinary.url(id, {height: 480, crop: 'fit', format: 'jpg'});
					}
				}
				//console.log(messages[i].image);
			}
			res.render('retroWeb/messages.ejs', {messages: messages, groupId: req.params.id})
		});
	}
});

router.get('/sendMsg/:groupId', (req, res)=>
{
	if (req.session.logged)
	{
		res.render('retroWeb/sendMsg.ejs', {groupId: req.params.groupId, userId: req.session.curuserid});
	}
});

router.get('/options', (req, res)=>
{
	if (req.session.logged)
	{
		res.render('retroWeb/options.ejs');
	}
});

router.post('/setOptions', (req, res)=>
{
	if (req.session.logged)
	{
		req.session.retroAutoReload = req.body.autoReload;
		res.redirect('/retroWeb/options');
	}
});

router.get('/htmlMsg/:msg', (req, res)=>
{
	res.render('retroWeb/htmlMsg.ejs', {msg: req.params.msg});
});

module.exports = router;