import {React, useState} from 'react';
import './css/Menu.css';
import logo from './images/LogoNoText.png';
import { isUserSignedIn, getUserName } from './firebase.js';

export default function Menu() {


	const [isSignedIn, setIsSignedIn] = useState(isUserSignedIn());
	console.log(isUserSignedIn());

	return (
		<nav>
			<div className="nav-left">
				<a href="/"><img src={logo} alt="Icon" width="50px" height="50px" title="icon"></img></a>
				{isSignedIn ? <h1>getUserName()</h1> : <></>}
			</div>
			<div className="nav-right">
				<a href="/">Knjige</a>
				<a href="/chat">Pogovor</a>
				<a href="/profile">Profil</a>
				<a style={{display: isSignedIn ? 'none' : ''}} href="/login">Prijava</a>
				<a style={{display: isSignedIn ? '' : 'none'}} href="/logout">Odjava</a>
			</div>
		</nav>
	)
}
