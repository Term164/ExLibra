import Reac, {useRef, useState} from 'react'
import { saveUserData } from '../Firebase';
import tempImg1 from '../images/pfp1.jpg';
import imageOverlay from '../images/upload-image.png';
import {CgCloseR} from 'react-icons/cg';

export default function UserProfile(props){


    const [isSaved , setIsSaved] = useState(false);
    const [isError, setIsError] = useState(false);

    let user = props.userData;

    const handleNotificationClick = event =>{
        setIsError(false);
        setIsSaved(false);
    }

    let savedConfirmation = <div className='notification sucess fadeInElement'><h2>Profil posodobljen</h2><button onClick={handleNotificationClick}><CgCloseR/></button></div>
    let errorMessage = <div className='notification error fadeInElement'><h2>Napaka pri posodabljanju</h2><button onClick={handleNotificationClick}><CgCloseR/></button></div>

    const name = useRef();
    const surname = useRef();
    const username = useRef();
    const email = useRef();
    const tel = useRef();

    

    const handleSaveUserData = async event => {
        try {
            await saveUserData(name.current.value, surname.current.value, username.current.value, email.current.value, tel.current.value);   
            //await saveUserData();
            setIsSaved(true);
        } catch (error) {
            //console.log(error);
            setIsError(true);
        }
    }


    return(
        <div className="profile">
            <div className="profile-image">
                <img src={tempImg1} alt="Pfp-1" />
                <img className="overlay" src={imageOverlay} alt="overlay" />
                <input type="file" accept=".png,.jpg,.jpeg" name="profile" />
            </div>
            <div className="profile-info">
                <div className="line">
                    <h3>Ime:</h3>
                    <input type="text" ref={name} name="name" defaultValue={user ? user.name : ""} />
                </div>
                <div className="line">
                    <h3>Priimek:</h3>
                    <input type="text" ref={surname} name="surname" defaultValue={user ? user.surname : ""} />
                </div>
                <div className="line">
                    <h3>Vzdevek:</h3>
                    <input type="text" ref={username} name="username" defaultValue={user ? user.username : ""} />
                </div>

                <div className="line">
                    <h3>Email:</h3>
                    <input type="email" ref={email} name="email" defaultValue={user ? user.email : ""} />
                </div>

                <div className="line">
                    <h3>Telefon:</h3>
                    <input type="tel" ref={tel} name="phone" defaultValue={user ? user.tel : ""} />
                </div>

                <div className="line">
                    <h3>Kraj:</h3>
                    <input type="text" name="location" defaultValue="Ljubljana" />
                </div>
            </div>
            <div className="options">
                <button>Logout</button>
                <button onClick={handleSaveUserData}>Save</button>
            </div>
            {isError && errorMessage}
            {isSaved && savedConfirmation}
        </div>
    );
}

