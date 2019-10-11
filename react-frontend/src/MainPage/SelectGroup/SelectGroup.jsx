import React, {Component} from 'react';

import "./SelectGroup.css";

class SelectGroup extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			//STUFF
			whichTab: 'private',
			privateGroups: [],
			contacts: []
		};
		this.getPrivateGroups();
		this.getContacts();
	}



	//This component only lets you select groups that you're already a member of
	//That includes:
	//Public groups
	//Private groups that you've joined or created
	//DMs (your entire contacts list)

	//It has three tabs for those three categories
	//In the DMs tab you can search by username


	handleChange = (e) =>
	{
		//e.preventDefault();
		console.log(e.currentTarget.name + ": " + e.currentTarget.value);
		this.setState(
		{
			[e.currentTarget.name]: e.currentTarget.value
		});
		//console.log(e.currentTarget.value);
	}


	getPrivateGroups = async () =>
	{
		let groups = await fetch(this.props.apiURL + '/groups/foruser/' + this.props.userId, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		groups = await groups.json();
		

		if (groups[0])
		{
			this.setState(
			{
				privateGroups: groups,
				groupId: groups[0].id,
				groupName: groups[0].name
			});
		}
		else
		{
			//do nothing
		}
	}

	getContacts = async () =>
	{
		let contacts = await fetch(this.props.apiURL + '/users/' + this.props.userId + '/contacts', {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		contacts = await contacts.json();
		this.setState(
		{
			contacts: await contacts
		});
	}

	groupClick = async (input, e) =>
	{
		if (this.state.whichTab == 'private' || this.state.whichTab == 'public')
		{
			//the input is a group id
			this.props.handleSelectGroup(input);
		}
		else if (this.state.whichTab == 'dms')
		{
			//the input is a contact (user) id and we need to get the
			//group id where the DMs are taking place. This is done via
			//a special route: '/groups/dms/user1_id/user2_id'
			//The backend will find the group and return its info,
			//and create it if it doesn't already exist.

			let groupInfo = await fetch(this.props.apiURL + '/groups/dms/' + this.props.userId + '/' + input, {
				method: 'GET',
				//body: JSON.stringify(data),
				headers:
				{
					"Content-Type": "application/json",
					"Authentication": this.props.sessionId
				}
			});

			groupInfo = await groupInfo.json();

			//We got the group now!

			//Now get the display name of the user we're DMing:

			this.state.contacts.forEach((contact, index) =>
			{
				if (contact._id == input)
				{
					//We found it!
					//Switch to the group:

					this.props.handleSelectGroup(groupInfo._id, contact.displayname);
				}
			})

			

		}
	}

	dmTabClick = () =>
	{
		this.setState(
		{
			whichTab: 'dms'
		});
	}

	privateTabClick = () =>
	{
		this.setState(
		{
			whichTab: 'private'
		});
	}

	publicTabClick = () =>
	{
		this.setState(
		{
			whichTab: 'public'
		});
	}

	handleAddContact = async (e) =>
	{
		e.preventDefault();

		//Check if the user exists:

		let userInfo = await fetch(this.props.apiURL + '/users/username/' + this.state.contactUsernameToAdd, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});

		userInfo = await userInfo.json();

		if (userInfo._id)
		{
			//We found the user! Add it to the contacts:
			if (userInfo._id == this.props.userId)
			{
				//It's the current user, can't DM yourself!
				alert("This is your username. You cannot DM yourself!")
			}
			else
			{
				//alert("User found");

				//The user has been found. Set up a DM with that user:

				let groupInfo = await fetch(this.props.apiURL + '/groups/dms/' + this.props.userId + '/' + userInfo._id, {
					method: 'GET',
					//body: JSON.stringify(data),
					headers:
					{
						"Content-Type": "application/json",
						"Authentication": this.props.sessionId
					}
				});

				groupInfo = await groupInfo.json();

				//We got the group now!

				//Switch to it:

				this.props.handleSelectGroup(groupInfo._id);
			}
		}
		else
		{
			alert("User not found");
		}
	}

	render()
	{
		return(
			<div className="selectGroupContainer">
				<div className="groupTabsContainer">
					<span className="singleGroupTab" onClick={this.dmTabClick}>Direct Messages</span>
					<span className="singleGroupTab" onClick={this.privateTabClick}>Private Groups</span>
					<span className="singleGroupTab" onClick={this.publicTabClick}>Public Groups</span>
				</div>
				<div className="groupsContainer">
					{this.state.whichTab == 'dms' ?
						<div>
							<span>Direct Messages</span><br/>
							<span>Add contacts by username:</span>
							<div className="addContactForm">
								<form onSubmit={this.handleAddContact}>
									<input name='contactUsernameToAdd' placeholder='Type here' onChange={this.handleChange}></input>
									<button type='submit'>Add Contact</button>
								</form>
							</div>
							{
								this.state.contacts.map((contact, index) =>
								{
									return(
										<span className="singleGroup" onClick={this.groupClick.bind(null, contact._id)}>
											{contact.displayname}
										</span>
									);
								})
							}
						</div>
					:
						null
					}
					{this.state.whichTab == 'private' ?
						<div>
							<span>Private Groups</span><br/><br/>
							{
								this.state.privateGroups.map((group, index) =>
								{
									if (group.type != 'dm')
									{
										return(
											<span className="singleGroup" onClick={this.groupClick.bind(null, group.id)}>
												{group.name}
											</span>
										);
									}
								})
							}
						</div>
					:
						null
					}
					{this.state.whichTab == 'public' ?
						<span>Public Groups</span>
					:
						null
					}
				</div>
			</div>
		);
	}
}

export default SelectGroup;



// <form onSubmit={this.props.handleSelectGroup.bind(null, this.state)}>
// 	<select type='text' name='groupId' onChange={this.handleChange}>
// 		{
// 			this.state.privateGroups.map((group, index) =>
// 			{
// 				return(
// 					<option key={index} value={group.id}>{group.name}</option>
// 				);
// 			})
// 		}
// 	</select>
// 	<button type='submit'>Enter Group</button>
// </form>