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
		let users = await fetch(apiURL + '/users');
		users = await users.json();
		if (users[0])
		{
			this.setState(
			{
				users: users,
				userId: users[0]._id
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