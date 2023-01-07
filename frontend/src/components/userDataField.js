import React, {useRef, useState} from 'react'
import { saveUserData, signOutUser, saveProfileImage } from '../Firebase';
import imageOverlay from '../images/upload-image.png';
import {CgCloseR} from 'react-icons/cg';


export default function UserProfile(props){


    const [isSaved , setIsSaved] = useState(false);
    const [isError, setIsError] = useState(false);
    
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

    let user = props.userData;
    let myimg;
    let input;
    let reader = new FileReader();

    async function uploadImg(){
        input = document.getElementById("fileInput");
        let imgToUpload = input.files[0];
        let url = await saveProfileImage(imgToUpload);
        return url;
    }

    const handleSaveUserData = async event => {
        event.preventDefault();
        try {
            let publicUrl = await uploadImg();
            await saveUserData(name.current.value, publicUrl, surname.current.value, username.current.value, email.current.value, tel.current.value);
            setIsSaved(true);
        } catch (error) {
            console.log(error);
            setIsError(true);
        }
    }
    const handleLogout = () => {
		signOutUser().then(() => {
			window.location.href = '/login';
		})
	}

    window.onload=function(){
        // Get html element references
        myimg = document.getElementById("image");
        input = document.getElementById("fileInput");
        // Add event listeners
        input.addEventListener('change', handleSelected);
        reader.addEventListener('load', handleEvent);
    }

    //select image for pfp
    function handleEvent(event) {
        myimg.src = reader.result;
    }
    
    function handleSelected(e) {      
        const selectedFile = input.files[0];
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    }
    
    return(
        <div className="profile">
            <div className="profile-image">
                <img id="image" src={user ? user.profileurl : 'https://firebasestorage.googleapis.com/v0/b/exlibra-563bd.appspot.com/o/pfp%2Fdefault.png?alt=media&token=aa0a928f-af17-4f5a-b835-cc53305ee0a4'} alt="Pfp-1" />
                <img className="overlay" src={imageOverlay} alt="overlay" />
                <input type="file" id="fileInput" accept=".png,.jpg,.jpeg" name="profile" />
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
                <button onClick={handleLogout}>Logout</button>
                <button onClick={handleSaveUserData}>Save</button>
            </div>
            {isError && errorMessage}
            {isSaved && savedConfirmation}
        </div>
    );
}

