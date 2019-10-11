import React, {Component} from 'react';

import './NavBar.css';

class BlankComponent extends Component
{
	constructor()
	{
		super();
		this.state =
		{
			settingsMenuClasses: "navBarSettingsMenu displayNone"
		};
	}

	componentDidMount()
	{
		this.setState(
		{
			gearImgSrc: this.props.apiURL + "/images/settings-gear.png"
		})
	}

	handleSettingsClick = () =>
	{
		//toggle the settings menu:
		
		if (this.state.settingsMenuClasses == "navBarSettingsMenu displayNone")
		{
			this.setState(
			{
				settingsMenuClasses: "navBarSettingsMenu"
			});
		}
		else
		{
			this.setState(
			{
				settingsMenuClasses: "navBarSettingsMenu displayNone"
			});
		}
	}

	render()
	{
		return(
			<div className="navBarContainer">
				<span className="navBarLogo">CleanChat</span>
				<img src={this.state.gearImgSrc} className="navBarSettingsButton" onClick={this.handleSettingsClick}/>
				<div className={this.state.settingsMenuClasses}>
					<span className="navBarSettingsMenuItem" onClick={this.props.toggleAccountSettings}>Account Settings</span>
					<span className="navBarSettingsMenuItem" onClick={this.props.toggleAboutModal}>About</span>
				</div>
			</div>
		);
	}
}

export default BlankComponent;