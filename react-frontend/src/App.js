import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import NavBar from './NavBar/NavBar';

import NewUser from './NewUser/NewUser';
import Login from './Login/Login';

import MainPage from './MainPage/MainPage';

import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';


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
			},
			aboutModal: false,
			accountSettings: false
		}
		this.getTest();
		//this.loginStatus();
	}

	handleChange = (e) =>
	{
		e.preventDefault();
		this.setState(
		{
			[e.currentTarget.name]: e.currentTarget.value
		});
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
		else
		{
			this.getUserInfo();
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


	getUserInfo = async () =>
	{
		//gets the user info from the Express API and stores it in the state:
		console.log("Getting user info in app.js");
		let userInfo = await fetch(this.state.apiURL + '/users/' + this.state.loggedIn.userId, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.state.loggedIn.sessionId
			}
		});
		userInfo = await userInfo.json();
		console.log(await userInfo);
		this.setState(
		{
			username: await userInfo.username,
			displayname: await userInfo.displayname,
			editUserDisplayname: await userInfo.displayname
		});
	}


	handleEditAccountSettings = async (e) =>
	{
		e.preventDefault();
		//console.log("handleSubmit on NewUser was called");
		//console.log(input);


		//here's where we make the POST request to create a new user:

		let editUserResponse = await fetch(this.state.apiURL + '/users/' + this.state.loggedIn.userId, {
			method: 'PUT',
			body: JSON.stringify(
				{
					displayname: this.state.editUserDisplayname
				}),
		    headers:
		    {
		    	"Content-Type": "application/json",
		    	"Authentication": this.state.loggedIn.sessionId
		    }
		});

		//console.log(await newUserResponse.json());

		editUserResponse = await editUserResponse.json();
		
		if (await editUserResponse.success)
		{
			alert("Edited account settings successfully");
		}
		else
		{
			alert("error");
		}
		this.getUserInfo();
	}

	toggleAboutModal = () =>
	{
		this.setState(
		{
			aboutModal: !this.state.aboutModal
		});
	}

	toggleAccountSettings = () =>
	{
		this.setState(
		{
			accountSettings: !this.state.accountSettings
		});
	}

	render()
	{
		return (
			<div className="App">
				

				<Modal isOpen={this.state.aboutModal} toggle={this.toggleAboutModal} className='aboutModal' size='lg'>
					<ModalHeader>
						About
					</ModalHeader>

					<ModalBody>
						This is a chat app that is intended to be, once and for all, the<br/><br/>

						ONE CHAT APP TO RULE THEM ALL<br/><br/>

						Make a user and try it out with a friend!<br/><br/>

						Since the app is under active development, the functionality of the app will change frequently. Anything you do on the app right now may be destroyed as I push updates and nuke the database here and there.<br/><br/>

						Here's a list of what this chat app will be:<br/><br/>

						Open source<br/>
						Openly documented<br/>
						Usable in everyday life for all your chat app needs, that you may have previously used several discrete apps for, all with their advantages and disadvantages<br/>
						Cross-platform: This is intended to be the most cross-platform chat app ever made. Users are encouraged to build their own clients using the documentation and source code provided.<br/>
						DMs, group messaging, and voice and video chat included and working on all platforms<br/><br/>
						
						Right now the backend is built in Node.js with Express, and the web frontend using React. Once proper functionality is achieved, more clients will be built for other platforms and systems, including smartphones.
					</ModalBody>

					<ModalFooter>
						<button onClick={this.toggleAboutModal}>Close</button>
					</ModalFooter>
				</Modal>


				<Modal isOpen={this.state.accountSettings} toggle={this.toggleAccountSettings} className='accountSettings' size='lg'>
					<ModalHeader>
						Account Settings
					</ModalHeader>

					<ModalBody>
						{this.state.loggedIn.success ?
							<div>
								<div>
									Account Settings<br/>
									The only thing you can change here right now is your display name.<br/>
								</div>
								<br/>
								<form>
									Display Name:<br/>
									<input name='editUserDisplayname' placeholder="Display Name" value={this.state.editUserDisplayname} onChange={this.handleChange}></input>
									<button onClick={this.handleEditAccountSettings}>Submit</button>
								</form>
							</div>
						:
							<div>You are logged out! Log in to access your account settings.</div>
						}
					</ModalBody>

					<ModalFooter>
						<button onClick={this.toggleAccountSettings}>Close</button>
					</ModalFooter>
				</Modal>

				



				<NavBar apiURL={this.state.apiURL} toggleAboutModal={this.toggleAboutModal} toggleAccountSettings={this.toggleAccountSettings}></NavBar>
				{this.state.loggedIn.success ?
					(
						<div>
							<MainPage apiURL={this.state.apiURL} userId={this.state.loggedIn.userId} sessionId={this.state.loggedIn.sessionId}></MainPage>
						</div>
					)
					:
					(
						<div>
							<h5><b>
								This website is now available over secure HTTPS! Make sure the URL in your browser says "https://" instead of "http://"
							</b></h5>
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