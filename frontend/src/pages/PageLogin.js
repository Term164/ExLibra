import React from 'react';
import '../css/PageLogin.css';

export default function PageLogin() {
  return (
    <div className="content-pl">
        <h2>Prijava</h2>
		<div className="reg">
            <input type="text" placeholder="Uporabnik/Email..." />
            <input type="password" placeholder="Geslo..." />
            <div className="line">
                <button>Prijava</button>
                <button>Registracija</button>
            </div>
        </div>
        <div className="google-reg">
            
        </div>
	</div>
  )
}
