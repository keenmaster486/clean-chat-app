import React, {Component} from 'react';

import ChatBox from '../ChatBox/ChatBox';
import NewGroup from './NewGroup/NewGroup';
import SelectGroup from './SelectGroup/SelectGroup';
import SelectUser from './SelectUser/SelectUser';


class MainPage extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			chatOn: true,
			currentGroup:
				{
					name: 'Enter a chat',
					type: '',
					id: ''
				}
		};
	}

	toggleChat = (groupname) =>
	{
		//e.preventDefault();
		if (this.state.chatOn)
		{
			//if we're exiting a chatbox, reset the current group info:
			this.setState(
			{
				currentGroup:
				{
					name: '',
					type: '',
					id: ''
				},
				chatOn: false
			});
			return;
		}
		else
		{
			this.setState(
			{
				chatOn: true
			});
			return;
		}
	}

	handleSelectGroup = (input, e) =>
	{
		e.preventDefault();
		console.log(input);
		let groupName;
		for (let i = 0; i < input.groups.length; i++)
		{
			if (input.groups[i].id == input.groupId)
			{
				groupName = input.groups[i].name;
				break;
			}
		}
		//const groupName = input.groups[input.selected].name;
		const groupId = input.groupId;
		console.log("Entering group " + groupName + " with id of " + groupId);

		this.setState(
		{
			currentGroup:
			{
				name: groupName,
				id: groupId
			}
		});
		//this.toggleChat();
		this.state.chatOn = true;
	}
	
	handleSelectUser = async (input, e) =>
	{
		e.preventDefault();

		//make the API call to add the user:
		const submitURL = this.props.apiURL + '/groups/' + this.state.currentGroup.id + '/adduser';

		let response = await fetch(submitURL, {
			method: 'PUT',
			body: JSON.stringify(
				{
					userId: input.userId
				}),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});

		response = await response.json();

		console.log(response);

		if (!response.success)
		{
			alert("error");
		}
		else
		{
			alert("added user " + input.userId + " to the group")
		}
	}

	render()
	{
		return(
			<div>
				<div>
					
					<SelectGroup apiURL={this.props.apiURL} handleSelectGroup={this.handleSelectGroup} userId={this.props.userId} sessionId={this.props.sessionId}></SelectGroup>

				</div>
				{this.state.chatOn ?
					<div>
						
						<ChatBox apiURL={this.props.apiURL} currentGroup={this.state.currentGroup} userId={this.props.userId} sessionId={this.props.sessionId}></ChatBox>
						<SelectUser apiURL={this.props.apiURL} handleSelectUser={this.handleSelectUser} sessionId={this.props.sessionId}></SelectUser>
					</div>
				:
				null
				}
			</div>
		);
	}
}

export default MainPage;


//<NewGroup apiURL={this.props.apiURL} userId={this.props.userId} sessionId={this.props.sessionId}></NewGroup>