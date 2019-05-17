import React, {Component} from 'react';

class LoginForm extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			username: '',
			password: '',
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
		e.preventDefault();
		this.setState(
		{
			[e.currentTarget.name]: e.currentTarget.value
		});
	}

	render()
	{
		return(
			<form onSubmit={this.props.handleSubmit.bind(null, this.state)}>
				<input type='text' name='username' placeholder='Username' onChange={this.handleChange}></input><br/>
				<input type='password' name='password' placeholder='Password' onChange={this.handleChange}></input><br/>
				<button type='submit'>Submit</button><br/>
			</form>
		);
	}
}

export default LoginForm;