import {React, useRef} from 'react';
import '../css/PageLogin.css';
import {BsGoogle} from 'react-icons/bs'
import { signInWithGoogle, signInDefault}  from '../firebase.js';
import { useNavigate } from 'react-router-dom';
import logo from '../images/exLibraLogoWhite.png'

export default function PageLogin() {

  let navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  async function googleLoginHandler(e) {
    e.preventDefault();
    await signInWithGoogle(); 
    navigate('/');
  }

  async function defaultLoginHandler(e){
    e.preventDefault();
    console.log(email.current.value, password.current.value);
    await signInDefault(email.current.value, password.current.value);
    navigate('/');
  }

  return (
    
    <div className="content-pl">
      <img src={logo} width="100%"/>
      <h1>Registracija</h1>
      <div className="reg">
        <form onSubmit={defaultLoginHandler}>
          <input ref={email} type="text" placeholder="Uporabnik/Email..." />
          <input ref={password} type="password" placeholder="Geslo..." />
          <div className="line">
            <button>Registracija</button>
          </div>
        </form>
      </div>
      <div className="google-reg">
        <form onSubmit={googleLoginHandler}>
          <button type='submit'><BsGoogle/> Google prijava</button>
        </form>
      </div>
	  </div>
  )
}
