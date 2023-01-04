import {React, useRef, useState} from 'react';
import '../css/PageLogin.css';
import {BsGoogle} from 'react-icons/bs'
import { signInWithGoogle, signInDefault}  from '../firebase.js';
import { SpinningCircles  } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom';
import logo from '../images/exLibraLogoWhite.png'

export default function PageLogin() {

  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    try {
      setIsLoading(true);
      await signInDefault(email.current.value, password.current.value);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      setIsActive(true);
    }
  }

  function navigateToRegister(e){
    e.preventDefault();
    navigate('/register');
  }

  

  return (
    <>
      <div className="content-pl">
        <img src={logo} width="100%"/>
        <h1>Prijava</h1>
        <span style={{
          display: isLoading ? '' : 'none',
        }
        }>
        <SpinningCircles  />
        </span>
        <h2 style={{
          display: isActive ? '' : 'none',
        }
        }>Wrong username or password.</h2>
        <div className="reg">
          <form onSubmit={defaultLoginHandler}>
            <input ref={email} type="text" placeholder="Uporabnik/Email..." />
            <input ref={password} type="password" placeholder="Geslo..." />
            <div className="line">
              <button type='submit'>Prijava</button>
              <button onClick={navigateToRegister}>Registracija</button>
            </div>
          </form>
        </div>
        <div className="google-reg">
          <form onSubmit={googleLoginHandler}>
            <button type='submit'><BsGoogle/> Google prijava</button>
          </form>
        </div>
      </div>
    </>
  )
}
