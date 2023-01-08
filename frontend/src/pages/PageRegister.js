import {React, useRef, useState} from 'react';
import '../css/PageRegister.css';
import {signInDefault, registerUserDefault}  from '../Firebase.js';
import { useNavigate } from 'react-router-dom';
import { SpinningCircles } from 'react-loading-icons'
import logo from '../images/exLibraLogoWhite.png'

export default function PageRegister() {

  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();
  const username = useRef();
  const email = useRef();
  const password = useRef();

  async function registerUserDefaultHandler(e){
    e.preventDefault();
    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    setIsLoading(true);
    await registerUserDefault(emailValue, passwordValue, username.current.value);
    setIsLoading(false);
    setIsActive(true);
    await signInDefault(emailValue, passwordValue);
    window.location.href = '/';
  }

  return (
    <div className="content-pr">
      <img src={logo} width="100%"/>
      <h1>Registracija</h1>
      <span style={{
          display: isLoading ? '' : 'none',
        }
        }>
        <SpinningCircles  />
      </span>
      <h2 style={{
          display: isActive ? '' : 'none',
        }
      }>Uspešno ste registrirani.</h2>
      <div className="reg">
        <form onSubmit={registerUserDefaultHandler}>
          <input ref={username} type="text" placeholder="Uporabniško ime..." />
          <input ref={email} type="text" placeholder="Email..." />
          <input ref={password} type="password" placeholder="Geslo..." />
          <button type='submit'>Registriraj me</button>
        </form>
      </div>
	  </div>
  )
}
