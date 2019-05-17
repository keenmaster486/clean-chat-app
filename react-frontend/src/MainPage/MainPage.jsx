import React, {Component} from 'react';

import ChatBox from '../ChatBox/ChatBox';
import NewGroup from './NewGroup/NewGroup';
import SelectGroup from './SelectGroup/SelectGroup';


class MainPage extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			chatOn: false,
			currentGroup:
				{
					name: '',
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
		//console.log(input);
		const groupName = input.groups[input.selected].name;
		const groupId = input.groups[input.selected].id;
		console.log("Entering group " + groupName + " with id of " + groupId);

		this.setState(
		{
			currentGroup:
			{
				name: groupName,
				id: groupId
			}
		});
		this.toggleChat();
	}
	

	render()
	{
		return(
			<div>
				{this.state.chatOn ?
					<div>
						<button className="medFont" onClick={this.toggleChat}>Exit the chat</button>
						<ChatBox apiURL={this.props.apiURL} currentGroup={this.state.currentGroup} userId={this.props.userId}></ChatBox>
						
					</div>
				:
					<div>
						Here is the main page<br/>
						Things you can do here (for now):<br/>
						-Create a new group<br/>
						-Enter the chat for a group<br/>

						<SelectGroup apiURL={this.props.apiURL} handleSelectGroup={this.handleSelectGroup}></SelectGroup>

						<NewGroup apiURL={this.props.apiURL} userId={this.props.userId}></NewGroup>
					</div>
				}
			</div>
		);
	}
}

export default MainPage;