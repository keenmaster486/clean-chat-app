import React, {Component} from 'react';

import NewGroupForm from './NewGroupForm/NewGroupForm';

import './NewGroup.css';


class NewGroup extends Component
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

		const submitURL = this.props.apiURL + "/groups";
		
		input.userId = this.props.userId;
		const newGroupFormData = JSON.stringify(input);
		

		let newGroupResponse = await fetch(submitURL, {
			method: 'POST',
			body: newGroupFormData,
		    headers: {"Content-Type": "application/json"}
		});
		newGroupResponse = await newGroupResponse.json();
		//this.props.changeState({newgroupresponse: await newgroupResponse})
		console.log(newGroupResponse);
		if (newGroupResponse.success)
		{
			alert("Created group successfully");
		}
		else
		{
			alert("error");
		}
	}

	render()
	{
		return(
			<div className="newgroupContainer">
				<h3>New Group</h3>
				<NewGroupForm handleSubmit={this.handleSubmit}></NewGroupForm>
			</div>
		);
	}
}

export default NewGroup;