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
				msgLength: 0
			},
			msgImage: '',
			imgPreview: false,
			imgPreviewSrc: ''
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
		let userInfo = await fetch(this.props.apiURL + '/users/' + this.props.userId);
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
		let groupInfo = await fetch(this.props.apiURL + '/groups/' + this.props.currentGroup.id);
		groupInfo = await groupInfo.json();
		this.setState(
		{
			currentGroup:
			{
				name: await groupInfo.name,
				id: await groupInfo.id,
				msgLength: await groupInfo.msgLength
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

		let recentMsgs = fetch(await submitURL);
		
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
		    {"Content-Type": "application/json",}
		});
		msgResponse = await msgResponse.json();
		console.log(msgResponse);
		return msgResponse.id;
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

				<div>
					<h2>{this.props.currentGroup.name}</h2>
				</div>
				<div className='chatboxcontainer'>
					<div className='chatbox'>
						<div className='spancontainer'>
							{
								this.state.messages.map((msg, index) =>
								{
									return(
										<span key={index} className={msg.userId == this.props.userId ? 'yourmsg' : 'othermsg'}>
											<b>{msg.userdisplayname}:</b> {msg.text}
											{msg.image ? <div className='imgInsideMsgContainer'><img onClick={this.toggleImgPreview} className='imgInsideMsg' src={msg.image}></img></div> : ''}
										</span>
									);
								})
							}
						</div>
					</div>
				<form onSubmit={this.addMsg}>
					<textarea id='msgtextbox' onChange={this.handleChange} rows='5' cols='67' type='text' name='msgText' placeholder='Your message here'></textarea><br/>
					<input id = 'imgtextbox' onChange={this.handleChange} name='msgImage' placeholder='You can put an image link here'></input>
					<button type='submit'>Send</button>
				</form>
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