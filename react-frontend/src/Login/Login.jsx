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

	

	render()
	{
		return(
			<div className="loginContainer">
				<h3>Log In</h3>
				<LoginForm handleSubmit={this.props.handleLogin}></LoginForm>
			</div>
		);
	}
}

export default Login;