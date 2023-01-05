import React from 'react';
import './css/Menu.css';
import logo from './images/LogoNoText.png';
import {getAuth} from './Firebase.js';

export default class Menu extends React.Component {

	state = {
		user: null
	}

	componentDidMount() {
		getAuth().onAuthStateChanged(user => {
		  this.setState({ user });
		});
	}

	handleLogout = () => {
		getAuth().signOut().then(() => {
			window.location.href = '/login';
		}).catch(error => {
			
		});
	}

	render() {
		let user = this.state.user;

		let logElement;
		let userName;

		if(user != null) {
			logElement = <a href="#" onClick={this.handleLogout}>Izpis</a>;
			userName = <h1>{user.displayName}</h1>;
		} else {
			logElement = <a href="/login">Prijava</a>;
		}

		return (
		<nav>
			<div className="nav-left">
			<a href="/"><img src={logo} alt="icon" width="50px" height="50px" title="icon"></img></a>
			{userName}
			</div>
			<div className="nav-right">
			<a href="/">Knjige</a>
			<a href="/chat">Pogovor</a>
			<a href="/profile">Profil</a>
			{logElement}
			</div>
		</nav>
		);
	}


}
