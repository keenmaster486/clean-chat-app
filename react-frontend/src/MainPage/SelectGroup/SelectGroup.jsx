import React, {Component} from 'react';

class SelectGroup extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			//STUFF
			groups: []
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
		let groups = await fetch(apiURL + '/groups/foruser/' + this.props.userId, {
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
				groups: groups,
				groupId: groups[0].id
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
				<form onSubmit={this.props.handleSelectGroup.bind(null, this.state)}>
					<select type='text' name='groupId' onChange={this.handleChange}>
						{
							this.state.groups.map((group, index) =>
							{
								return(
									<option key={index} value={group.id}>{group.name}</option>
								);
							})
						}
					</select>
					<button type='submit'>Enter Group</button>
				</form>
			</div>
		);
	}
}

export default SelectGroup;