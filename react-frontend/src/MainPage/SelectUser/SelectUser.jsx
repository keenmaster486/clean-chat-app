import React, {Component} from 'react';

class SelectUser extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			//STUFF
			users: []
		};
		this.getOptions(this.props.apiURL);
	}


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


	getOptions = async (apiURL) =>
	{
		let contacts = await fetch(apiURL + '/users/' + this.props.userId + '/contacts', {
			method: 'GET',
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		contacts = await contacts.json();
		if (contacts[0])
		{
			this.setState(
			{
				users: contacts,
				userId: contacts[0]._id
			});
		}
		else
		{
			//do nothing
		}
	}

	render()
	{
		return(
			<div>
				<form onSubmit={this.props.handleSelectUser.bind(null, this.state)}>
					<select type='text' name='userId' onChange={this.handleChange}>
						{
							this.state.users.map((user, index) =>
							{
								return(
									<option key={index} value={user._id}>{user.displayname}</option>
								);
							})
						}
					</select>
					<button type='submit'>Add User</button>
				</form>
			</div>
		);
	}
}

export default SelectUser;