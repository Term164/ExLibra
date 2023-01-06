import {React, useRef, useState} from 'react';
import '../css/PageLogin.css';
import {BsGoogle} from 'react-icons/bs'
import { signInWithGoogle, signInDefault, getUserSignedIn}  from '../Firebase.js';
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
    try {
      const result = await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error(error);
      //TODO need to add some error message or something !!!!!!!!!
    }
  }

  async function defaultLoginHandler(e){
    e.preventDefault();
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
        }>Napačno geslo ali email.</h2>
        <div className="reg">
          <form onSubmit={defaultLoginHandler}>
            <input ref={email} type="text" placeholder="Email..." />
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
