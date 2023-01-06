import Menu from './Menu';
import PageBooks from './pages/PageBooks';
import PageChat from './pages/PageChat';
import PageLogin from './pages/PageLogin';
import PageProfile from './pages/PageProfile';
import PageSell from './pages/PageSell';
import PageRegister from './pages/PageRegister';
import './css/Style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PagePrivacy from './pages/PagePrivacy';
import React from 'react';
import {getAuth, getUserData, isUserSignedIn} from './Firebase.js';

class App extends React.Component {

  state = {
    user: null
  }

  componentDidMount() {
		getAuth().onAuthStateChanged(async user => {
      if(isUserSignedIn()){
        this.setState({user: await getUserData()});
      }
		});
	}

  render(){
    return (
      <>
      <Menu userData = {this.state.user}/>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<PageBooks userData = {this.state.user}/>} />
          <Route path="/chat" element={<PageChat />} />
          <Route path="/profile" element={<PageProfile userData = {this.state.user}/>} />
          <Route path="/sell" element={<PageSell />} />
          <Route path="/login" element={<PageLogin />} />
          <Route path="/privacy" element={<PagePrivacy />} />
          <Route path='/register' element={<PageRegister/>} />
        </Routes>
      </BrowserRouter>
      </>
    );
  }
}

export default App;
