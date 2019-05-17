import React, {Component} from 'react';

class GiphySearchBox extends Component
{
	constructor()
	{
		super()
		this.state =
		{
			//STUFF
		}
	}

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
			<div>
				You can search for gifs on Giphy using this search box.<br/>
				Click on an image and a link to it will be added to your message.<br/>
				<form onSubmit = {this.props.handleSearch.bind(null, this.state)}>
					<input type='text' name='searchterms' placeholder='Search for gifs here' onChange={this.handleChange}></input>
					<button type='submit'>Search</button>
				</form>
				<span className='poweredBy'>Powered by Giphy</span>
			</div>
		);
	}
}

export default GiphySearchBox;