import React, {Component} from 'react';

import GiphySearchBox from './GiphySearchBox/GiphySearchBox';

import './GiphySearch.css';

class GiphySearch extends Component
{
	constructor()
	{
		super()
		this.state =
		{
			results:
			{
				data: []
			},
			selected: null
		}
	}

	handleSearch = async (input, e) =>
	{
		e.preventDefault();
		//console.log(await input.searchterms);
		//Now we have the search terms from the search box, in input.searchterms

		this.setState(
		{
			results:
			{
				data: []
			},
			selected: null
		})

		const temp = await fetch('https://api.giphy.com/v1/gifs/search?q=' + input.searchterms + '&api_key=kPX2zaN2zSBQOj68R7Org9XX9M3ZXK1B');
		const results = await temp.json();
		console.log(await results);
		this.setState(
		{
			results: await results,
		});
		//console.log(await this.state.results.data[0]);
	}

	listOfGifs = () =>
	{
		//Returns some <img>s of gifs from the state
		return this.state.results.data.map((gif) =>
		{
			const url = "https://i.giphy.com/media/" + gif.id + "/giphy.webp";
			return(
				<img src={url}/>
			);
		});
	}

	handleClick = (index, e) =>
	{
		//console.log(index);
		this.setState(
		{
			selected: index
		});
		this.props.handleGifClick(e.currentTarget.src);
	}

	render()
	{
		return(
			<div className='giphySearchContainer'>
				<GiphySearchBox handleSearch={this.handleSearch}></GiphySearchBox>
				<ul>
					{
						this.state.results.data.map((gif, index) =>
						{
							return(
								<img key={index} onClick={this.handleClick.bind(null, index)} className={this.state.selected != index ? 'gif' : 'gif gifClicked'} src={"https://i.giphy.com/media/" + gif.id + "/giphy.webp"}/>
							);
						})
					}
				</ul>
			</div>
		);
	}
}

export default GiphySearch;