import React, {Component} from 'react';

import "./ChatBox.css";


import GiphySearch from '../GiphySearch/GiphySearch';


import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class ChatBox extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			//STUFF
			messages: [],
			currentGroup:
			{
				name: '',
				id: '',
				type: '',
				otherUserName: '',
				msgLength: 0
			},
			msgImage: '',
			imgPreview: false,
			imgPreviewSrc: '',
			editMsg: false,
			msgId: ''
		};
		this.getUserInfo();
		this.getGroupInfo();
	}

	componentDidMount()
	{
		//set up an interval timer to get new messages:
		const newMsgInterval = setInterval(this.getGroupInfo, 1000);
		this.setState(
		{
			newMsgInterval: newMsgInterval
		});
	}
	componentWillUnmount()
	{
		clearInterval(this.state.newMsgInterval);
	}

	getUserInfo = async () =>
	{
		//gets the user info from the Express API and stores it in the state:
		let userInfo = await fetch(this.props.apiURL + '/users/' + this.props.userId, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		userInfo = await userInfo.json();
		this.setState(
		{
			username: await userInfo.username,
			displayname: await userInfo.displayname
		});
	}

	getGroupInfo = async () =>
	{
		//don't do anything if we're in the global chatroom:
		//if (this.props.currentGroup.name == 'global') {return;}

		const oldMsgLength = this.state.currentGroup.msgLength;

		//gets the group info from the Express API and stores it in the state:
		let groupInfo = await fetch(this.props.apiURL + '/groups/' + this.props.currentGroup.id, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		groupInfo = await groupInfo.json();

		// if (groupInfo.type == 'dm' && this.state.currentGroup.otherUserName != '')
		// {
		// 	groupInfo.users.forEach(async (user, index) =>
		// 	{
		// 		if (user._id != this.props.userId)
		// 		{
		// 			//console.log(user.displayname);
		// 			let userInfo = await fetch(this.props.apiURL + '/users/' + user._id, {
		// 				method: 'GET',
		// 				//body: JSON.stringify(data),
		// 				headers:
		// 				{
		// 					"Content-Type": "application/json",
		// 					"Authentication": this.props.sessionId
		// 				}
		// 			});

		// 			userInfo = await userInfo.json();

		// 			this.setState(
		// 			{
		// 				currentGroup:
		// 				{
		// 					otherUserName: userInfo.displayname
		// 				}
		// 			});
		// 		}
		// 	});
		// }

		this.setState(
		{
			currentGroup:
			{
				name: await groupInfo.name,
				id: await groupInfo.id,
				msgLength: await groupInfo.msgLength,
				otherUserName: this.props.currentGroup.otherUserName
			}
		});
		const msgLength = await groupInfo.msgLength;
		if (oldMsgLength != msgLength)
		{
			await this.getMessages();
		}
	}

	getMessages = async (howMany = 25) =>
	{
		//gets the most recent messages from the Express API!!!!
		//and then stores them in the state's messages array
		
		//we'll have to have re-gotten the group info in order to have the most recent msgLength!

		const msgLength = await this.state.currentGroup.msgLength;

		//let startmsg = await this.state.currentGroup.msgLength - 5;
		//if (startmsg < 0) {startmsg = 0;}
		//let startmsg = 0;
		
		let startmsg = msgLength - howMany;
		if (startmsg < 0) {startmsg = 0;}


		let endmsg = msgLength;

		const submitURL = await this.props.apiURL + '/groups/' + await this.state.currentGroup.id + '/messages/' + await startmsg + '/' + await endmsg;

		let recentMsgs = fetch(await submitURL, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		
		console.log(await recentMsgs);
		let test = await recentMsgs;
		recentMsgs = await test.json();
		
		this.setState(
		{
			messages: await recentMsgs
		});
	}

	handleChange = (e) =>
	{
		e.preventDefault();
		this.setState(
		{
			[e.currentTarget.name]: e.currentTarget.value
		});
		//console.log(this.state);
	}

	addMsgAPICall = async (newMsg) =>
	{
		const submitURL = this.props.apiURL + '/groups/' + this.state.currentGroup.id + '/messages';

		let msgResponse = await fetch(submitURL, {
			method: 'POST',
			body: JSON.stringify(newMsg),
			headers:
		    {
		    	"Content-Type": "application/json",
		    	"Authentication": this.props.sessionId
		    }
		});
		msgResponse = await msgResponse.json();
		console.log(msgResponse);
		return msgResponse.id;
	}

	addEditMsg = async (e) =>
	{
		e.preventDefault();
		const msgText = this.state.msgText;
		let msgImage = null;
		if (this.state.msgImage) {msgImage = this.state.msgImage;}

		const newMsg =
		{
			userId: this.props.userId,
			userdisplayname: this.state.displayname,
			text: msgText,
			image: msgImage,
			video: '',
			url: '',
			id: this.state.msgId
		}

		const submitURL = this.props.apiURL + '/groups/' + this.state.currentGroup.id + '/messages';

		let msgResponse = await fetch(submitURL, {
			method: 'PUT',
			body: JSON.stringify(newMsg),
			headers:
		    {
		    	"Content-Type": "application/json",
		    	"Authentication": this.props.sessionId
		    }
		});
		msgResponse = await msgResponse.json();
		console.log(msgResponse);
		
		this.setState(
		{
			msgText: '',
			msgImage: '',
			msgId: ''
		});

		this.getMessages();

		document.getElementById('msgtextbox').value = '';
		document.getElementById('imgtextbox').value = '';

		this.toggleEditMsg();
	}

	addMsg = async (e) =>
	{
		e.preventDefault();
		const msgText = this.state.msgText;
		let msgImage = null;
		if (this.state.msgImage) {msgImage = this.state.msgImage;}
		
		const newMsg =
		{
			userId: this.props.userId,
			userdisplayname: this.state.displayname,
			text: msgText,
			image: msgImage,
			video: '',
			url: '',
			id: ''
		};

		//Right here is where we should make a POST request to
		//the Express API to add the message to the current
		//group's message array


		//if (this.props.currentGroup.name == 'global')
		//{
			//do something for global
		//}
		//else
		//{
			//Express API call to add message to group!
			newMsg.id = await this.addMsgAPICall(newMsg);
			console.log("newMsg.id: " + newMsg.id);
		//}

		this.setState(
		{
			msgText: '',
			msgImage: '',
			messages: [...this.state.messages, await newMsg]
		});

		document.getElementById('msgtextbox').value = '';
		document.getElementById('imgtextbox').value = '';
	}


	handleGifClick = (src, e) =>
	{
		//console.log(e.currentTarget.src);
		document.getElementById('imgtextbox').value = src;
		this.setState(
		{
			msgImage: src
		});
	}

	toggleImgPreview = (e) =>
	{
		this.setState(
		{
			imgPreview: !this.state.imgPreview,
			imgPreviewSrc: e.currentTarget.src
		});
	}

	handleEditMsgClick = async (index, e) =>
	{
		e.preventDefault();
		this.setState(
		{
			msgId: this.state.messages[index]._id,
			msgText: this.state.messages[index].text,
			msgImage: this.state.messages[index].image
		});
		this.toggleEditMsg();
	}

	handleDeleteMsgClick = async (index, e) =>
	{
		e.preventDefault();
		//Delete the message:
		const submitURL = this.props.apiURL + '/groups/' + this.state.currentGroup.id + '/messages';

		const input =
		{
			id: this.state.messages[index]._id,
			userId: this.props.userId
		}

		let msgResponse = await fetch(submitURL, {
			method: 'DELETE',
			body: JSON.stringify(input),
			headers:
		    {
		    	"Content-Type": "application/json",
		    	"Authentication": this.props.sessionId
		    }
		});
		msgResponse = await msgResponse.json();
		console.log(msgResponse);

		//this.getMessages();
	}

	toggleEditMsg = (e) =>
	{
		// if (!this.state.editMsg)
		// {
		// 	//if we're OPENING the editing modal:
		// 	this.setState(
		// 	{

		// 	});
		// }
		this.setState(
		{
			editMsg: !this.state.editMsg
		});
	}

	render()
	{
		return(
			<div>
				
				<Modal isOpen={this.state.imgPreview} toggle={this.toggleImgPreview} className='imgPreview' size='lg'>
					<ModalHeader>
						Image Preview
					</ModalHeader>

					<ModalBody>
						<center><img className="imgInsidePreview" src={this.state.imgPreviewSrc}></img></center>
					</ModalBody>

					<ModalFooter>
						<button onClick={this.toggleImgPreview}>Close</button>
					</ModalFooter>
				</Modal>


				<Modal isOpen={this.state.editMsg} toggle={this.toggleEditMsg} className='editMsg' size='lg'>
					<ModalHeader>
						Editing Message
					</ModalHeader>

					<ModalBody>
						<form onSubmit={this.addEditMsg}>
							<textarea id='msgedittextbox' onChange={this.handleChange} rows='5' cols='60' type='text' name='msgText' placeholder='Your message here'>{this.state.msgText}</textarea><br/>
							<input value={this.state.msgImage} id = 'imgedittextbox' onChange={this.handleChange} name='msgImage' placeholder='You can put an image link here'></input>
							<button type='submit'>Send</button>
						</form>
						{
							this.state.msgImage != '' &&
							<div className='imgInsideMsgContainer'><img onClick={this.toggleImgPreview} className='imgInsideMsg' src={this.state.msgImage}/></div>
						}
						<GiphySearch handleGifClick={this.handleGifClick}></GiphySearch>
					</ModalBody>

					<ModalFooter>
						<button onClick={this.toggleEditMsg}>Close</button>
					</ModalFooter>
				</Modal>



				

				<div className='chatboxcontainer'>
					<div className='chatboxGroupName'>
						{this.state.currentGroup.type == 'dm' ?
							this.state.currentGroup.name
						:
							this.state.currentGroup.otherUserName
						}
					</div>
					<div className='chatbox'>
						<div className='spancontainer'>
							{
								this.state.messages.map((msg, index) =>
								{
									return(
										
										<span key={index} className={msg.userId == this.props.userId ? 'yourmsg' : 'othermsg'}>
											<font face='courier new'><b>{msg.userdisplayname}:</b></font> {msg.text}
											{msg.userId == this.props.userId &&
												<div>
													<button className="editButton" onClick={this.handleEditMsgClick.bind(null, index)}>Edit</button>
													<button className="editButton" onClick={this.handleDeleteMsgClick.bind(null, index)}>Delete</button>
												</div>
											}
											{msg.image ? <div className='imgInsideMsgContainer'><img onClick={this.toggleImgPreview} className='imgInsideMsg' src={msg.image}></img></div> : ''}
										</span>

										
									);
								})
							}
						</div>
					</div>
					{this.state.currentGroup.id != '' && this.state.currentGroup.id ?
						<form onSubmit={this.addMsg}>
							<textarea id='msgtextbox' onChange={this.handleChange} type='text' name='msgText' placeholder='Your message here'></textarea><br/>
							<input id = 'imgtextbox' onChange={this.handleChange} name='msgImage' placeholder='You can put an image link here'></input>
							<button id='sendbtn' type='submit'>Send</button>
						</form>
					:
						<div>
							Enter a group to send messages
						</div>
					}
					{
						this.state.msgImage != '' &&
						<div className='imgInsideMsgContainer'><img onClick={this.toggleImgPreview} className='imgInsideMsg' src={this.state.msgImage}/></div>
					}
				</div>
				
				<GiphySearch handleGifClick={this.handleGifClick}></GiphySearch>
		</div>

		);
	}
}





/*
<span className='person2'><b>Person 2:</b> Four score and seven years ago, our fathers brought forth upon this continent a new nation</span>
<span className='person1'><b>Person 1:</b> ksjdkfjdskfj</span>
<span className='person2'><b>Person 2:</b> yo</span>
<span className='person1'><b>Person 1:</b> hey</span>
<span className='person2'><b>Person 2:</b> yo</span>
<span className='person1'><b>Person 1:</b> hey</span>
<span className='person2'><b>Person 2:</b> yo</span>
<span className='person1'><b>Person 1:</b> hey</span>
<span className='person2'><b>Person 2:</b> yo</span>
<span className='person1'><b>Person 1:</b> hey</span>
<span className='person2'><b>Person 2:</b> yo</span>
<span className='person1'><b>Person 1:</b> hey</span>
<span className='person2'><b>Person 2:</b> yo</span>
<span className='person1'><b>Person 1:</b> hey</span>
*/





export default ChatBox;