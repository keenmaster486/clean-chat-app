import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import NewUser from './NewUser/NewUser';
import Login from './Login/Login';

import MainPage from './MainPage/MainPage';


class App extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			apiURL: process.env.REACT_APP_BACKEND_ADDRESS,
			loggedIn:
			{
				success: false,
				sessionId: ''
			}
		}
		this.getTest();
		//this.loginStatus();
	}

	getTest = async () =>
	{
		const test = await fetch(this.state.apiURL + '/status', {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.state.loggedIn.sessionId
			}
		});
		const testjson = await test.json();
		//console.log(await test.json());
		console.log(await testjson.text);

		this.setState(
		{
			text: await testjson.text
		});
	}

	getAuth = async () =>
	{
		if (!this.state.loggedIn.success)
		{
			console.log("Cannot getAuth: not logged in");
		}
		else
		{
			const data =
			{
				sessionId: this.state.loggedIn.sessionId
			}
			let response = await fetch(this.state.apiURL + '/auth/status', {
				method: 'GET',
				//body: JSON.stringify(data),
				headers:
				{
					"Content-Type": "application/json",
					"Authentication": this.state.loggedIn.sessionId
				}
			});
			response = await response.json();
			console.log(await response);
		}
	}

	// loginStatus = async () =>
	// {
	// 	const temp = await fetch(this.state.apiURL + "/auth/status");
	// 	if (temp == 'status: logged in')
	// 	{
	// 		this.setState(
	// 		{
	// 			loggedIn: 'logged in'
	// 		});
	// 	}
	// 	else
	// 	{
	// 		this.setState(
	// 		{
	// 			loggedIn: 'not logged in'
	// 		});
	// 	}
	// }

	changeState = (input, e) =>
	{
		this.setState(input);
	}



	handleLogin = async (input, e) =>
	{
		e.preventDefault();
		//console.log("handleSubmit on NewUser was called");
		//console.log(input);


		//here's where we make the POST request to create a new user:

		const submitURL = this.state.apiURL + "/auth/login";
		
		let loginResponse = await fetch(submitURL, {
			method: 'POST',
			body: JSON.stringify(input),
		    headers: {"Content-Type": "application/json"}
		});
		
		loginResponse = await loginResponse.json();
		
		this.setState(
		{
			loggedIn: loginResponse
		});

		console.log(loginResponse);

		if (!loginResponse.success)
		{
			alert("error");
		}

		//const success = await loginResponse.success;
		//if (!success) {alert("error");}
	}


	logState = () =>
	{
		console.log(this.state);
	}

	logOut = async (e) =>
	{
		e.preventDefault();

		let response = await fetch(this.state.apiURL + '/auth/logout', {
			method: 'GET',
			//body: JSON.stringify(input),
		    headers:
		    {
		    	"Content-Type": "application/json",
		    	"Authentication": this.state.loggedIn.sessionId
		    }
		});

		response = await response.json();

		alert(await response.message);

		this.setState(
		{
			loggedIn: {success: false, sessionId: ''}
		});
	}

	render()
	{
		return (
			<div className="App">
				<h4><i><b>CleanChat</b></i></h4>
				{this.state.loggedIn.success ?
					(
						<div>
							<MainPage apiURL={this.state.apiURL} userId={this.state.loggedIn.userId} sessionId={this.state.loggedIn.sessionId}></MainPage>
						</div>
					)
					:
					(
						<div>
						
							<div className="notLoggedInContainer">
								<NewUser apiURL={this.state.apiURL} changeState={this.changeState}></NewUser>
								<Login apiURL={this.state.apiURL} handleLogin={this.handleLogin}></Login>
							</div>
						</div>
					)
				}
				<div align='center' className='footer'>
					{this.state.loggedIn.success ? <div><button className="medFont" onClick={this.logOut}>Log Out</button></div> : ''}
					<i>This app was made using nothing but IBM Selectric typewriters</i>
				</div>
			</div>
		);
	}
}

export default App;



//<button onClick={this.getAuth}>getAuth</button>
//<b>Status:</b> {this.state.text}<br/>