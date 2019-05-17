import React, {Component} from 'react';

import LoginForm from './LoginForm/LoginForm';

import './Login.css';

class Login extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
		};
	}

	handleSubmit = async (input, e) =>
	{
		e.preventDefault();
		//console.log("handleSubmit on NewUser was called");
		//console.log(input);


		//here's where we make the POST request to create a new user:

		const submitURL = this.props.apiURL + "/auth/login";
		
		let loginResponse = await fetch(submitURL, {
			method: 'POST',
			body: JSON.stringify(input),
		    headers: {"Content-Type": "application/json"}
		});
		loginResponse = await loginResponse.json();
		this.props.changeState({loggedIn: loginResponse})
		console.log(loginResponse);

		if (!loginResponse.success)
		{
			alert("error");
		}



		//const success = await loginResponse.success;
		//if (!success) {alert("error");}
	}

	render()
	{
		return(
			<div className="loginContainer">
				<h3>Log In</h3>
				<LoginForm handleSubmit={this.handleSubmit}></LoginForm>
			</div>
		);
	}
}

export default Login;