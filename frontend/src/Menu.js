import React from 'react';
import './css/Menu.css';
import logo from './images/LogoNoText.png';
import {signOutUser} from './Firebase.js'

export default class Menu extends React.Component {

	handleLogout = () => {
		signOutUser().then(() => {
			window.location.href = '/login';
		})
	}

	render() {
		let user = this.props.userData;

		let logElements;
		let userName;

		if(user != null) {
			logElements = <><a href="/chat">Pogovor</a><a href="/profile">Profil</a><a href="#" onClick={this.handleLogout}>Izpis</a></>;
			userName = <h1>{user.username}</h1>;
		} else {
			logElements = <a href="/login">Prijava</a>;
		}

		return (
		<nav>
			<div className="nav-left">
			<a href="/"><img src={logo} alt="icon" width="50px" height="50px" title="icon"></img></a>
			{userName}
			</div>
			<div className="nav-right">
			<a href="/">Knjige</a>
			{logElements}
			</div>
		</nav>
		);
	}


}
