import React from 'react';
import './css/Menu.css';
import logo from './images/LogoNoText.png';

export default function Menu() {
  return (
    <nav>
		<div className="nav-left">
			<a href="/"><img src={logo} alt="Icon" width="50px" height="50px" title="icon"></img></a>
		</div>
		<div className="nav-right">
			<a href="/">Knjige</a>
			<a href="/chat">Pogovor</a>
			<a href="/profile">Profil</a>
			<a href="/login">Prijava</a>
		</div>
	</nav>
  )
}
