import React, {Component} from 'react';

class NewGroupForm extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			name: '',
			topic: '',
			type: 'std',
			category: '',
			allowinvite: 'off',
			joinpolicy: 0,
			private: 'off',
		};
	}

	// handleSubmit = (e) =>
	// {
	// 	e.preventDefault();
	// 	const submitURL = this.props.apiURL + "/users";
	// 	const testObj = {
	// 		[e.currentTarget.name]: e.currentTarget.value
	// 	};
	// 	console.log(testObj);
	// 	fetch(submitURL, {
	// 		method: 'POST',
	// 		body: JSON.stringify(
	// 		{
	// 			[e.target.name]: e.target.value
	// 		}),
	// 	    headers: {"Content-Type": "application/json"}
	// 	});
	// }

	handleChange = (e) =>
	{
		//e.preventDefault();
		this.setState(
		{
			[e.currentTarget.name]: e.currentTarget.value
		});
		//console.log(e.currentTarget.value);
	}

	logState = (e) =>
	{
		e.preventDefault();
		console.log(this.state);
	}

	render()
	{
		return(
			<div>
				
				
				<form onSubmit={this.props.handleSubmit.bind(null, this.state)}>
					<input type='text' name='name' placeholder='Group name' onChange={this.handleChange}></input><br/>
					<input type='text' name='category' placeholder='Category' onChange={this.handleChange}></input><br/>
					<input type='text' name='topic' placeholder='Topic' onChange={this.handleChange}></input><br/>
					Type:<br/>
					<select type='text' name='type' onChange={this.handleChange}>
						<option value='std'>Standard</option>
						<option value='DM'>Direct message</option>
					</select><br/>
					<select type='text' name='private' onChange={this.handleChange}>
						<option value='off'>Public group</option>
						<option value='on'>Private group</option>
					</select><br/>
					<br/>
					Join policy:<br/>
					<select type='text' name='joinpolicy' onChange={this.handleChange}>
						<option value='0'>Allow all</option>
						<option value='1'>Request/invite only</option>
						<option value='2'>Invite only</option>
					</select><br/>
					Allow non-admins to send invites:<br/>
					<select type='text' name='allowinvite' onChange={this.handleChange}>
						<option value='on'>Yes</option>
						<option value='off'>No</option>
					</select><br/>
					<br/>
					<br/>
					<button type='submit'>Submit</button>
				</form>
			</div>
		);
	}
}

export default NewGroupForm;