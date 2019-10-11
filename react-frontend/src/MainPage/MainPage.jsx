import React, {Component} from 'react';

import ChatBox from '../ChatBox/ChatBox';
import NewGroup from './NewGroup/NewGroup';
import SelectGroup from './SelectGroup/SelectGroup';

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import "./MainPage.css";

class MainPage extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			chatOn: true,
			selectGroupModal: false,
			createGroupModal: false,
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

	handleSelectGroup = (groupId, contactDisplayName) =>
	{
		//e.preventDefault();
		//console.log(input);
		// let groupName;
		// for (let i = 0; i < input.privateGroups.length; i++)
		// {
		// 	if (input.privateGroups[i].id == input.groupId)
		// 	{
		// 		groupName = input.privateGroups[i].name;
		// 		break;
		// 	}
		// }
		//const groupName = input.groups[input.selected].name;
		//const groupId = input.groupId;
		//console.log("Entering group " + groupName + " with id of " + groupId);
		
		this.setState(
		{
			currentGroup:
			{
				//name: groupName,
				id: groupId,
				otherUserName: contactDisplayName
			}
		});
		//this.toggleChat();
		//this.state.chatOn = true;
		//this.state.selectGroupModal = false;
		this.setState(
		{
			chatOn: true,
			selectGroupModal: false
		});
	}
	
	

	toggleSelectGroup = () =>
	{
		this.setState(
		{
			selectGroupModal: !this.state.selectGroupModal
		});
	}

	toggleCreateGroupModal = () =>
	{
		this.setState(
		{
			createGroupModal: !this.state.createGroupModal
		});
	}

	

	render()
	{
		return(
			<div>
				<div>
					
					<button onClick={this.toggleSelectGroup} className="switchChatButton">Switch chat</button>

					<button onClick={this.toggleCreateGroupModal} className="createGroupButton">Create a new group</button>

					<Modal isOpen={this.state.selectGroupModal} toggle={this.toggleSelectGroup} className='selectGroupModal' size='lg'>
						<ModalHeader>
							Select Chat
						</ModalHeader>

						<ModalBody>
							<SelectGroup apiURL={this.props.apiURL} handleSelectGroup={this.handleSelectGroup} userId={this.props.userId} sessionId={this.props.sessionId}></SelectGroup>
						</ModalBody>

						<ModalFooter>
							<button onClick={this.toggleSelectGroup}>Close</button>
						</ModalFooter>
					</Modal>


					<Modal isOpen={this.state.createGroupModal} toggle={this.toggleCreateGroupModal} className='createGroupModal' size='lg'>
						<ModalHeader>
							Create New Group
						</ModalHeader>

						<ModalBody>
							<NewGroup apiURL={this.props.apiURL} userId={this.props.userId} sessionId={this.props.sessionId}></NewGroup>
						</ModalBody>

						<ModalFooter>
							<button onClick={this.toggleCreateGroupModal}>Close</button>
						</ModalFooter>
					</Modal>

					


				</div>
				{this.state.chatOn ?
					<div>
						
						<ChatBox apiURL={this.props.apiURL} currentGroup={this.state.currentGroup} userId={this.props.userId} sessionId={this.props.sessionId}></ChatBox>
						
					</div>
				:
				null
				}
			</div>
		);
	}
}

export default MainPage;