import React, {Component} from 'react';

class SelectGroup extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			//STUFF
			groups: [],
			selected: 0
		};
		this.getOptions(this.props.apiURL);
	}



	handleChange = (e) =>
	{
		//e.preventDefault();
		this.setState(
		{
			[e.currentTarget.name]: e.currentTarget.value
		});
		//console.log(e.currentTarget.value);
	}


	getOptions = async (apiURL) =>
	{
		let groups = await fetch(apiURL + '/groups');
		groups = groups.json();
		this.setState(
		{
			groups: await groups
		});
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