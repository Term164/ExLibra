import React, {useRef, useState} from 'react'
import { saveUserData, signOutUser, ref, getPfp } from '../Firebase';
import imageOverlay from '../images/upload-image.png';
import {CgCloseR} from 'react-icons/cg';
import { getStorage, uploadBytesResumable } from 'firebase/storage';


export default function UserProfile(props){


    const [isSaved , setIsSaved] = useState(false);
    const [isError, setIsError] = useState(false);
    const storage = getStorage();
    
    window.onload=function(){
        getPfp();
        myimg = document.getElementById("image");
        input = document.getElementById("fileInput");
        
        input.addEventListener('change', handleSelected);
        
        
    }
    

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

    async function uploadImg(){
        
        input = document.getElementById("fileInput");
        
        let imgToUpload = input.files[0];
        console.log(imgToUpload.type);
        let koncnica = imgToUpload.type.split("/");
        console.log(koncnica);
        const metaData = {
            contentType: imgToUpload.type
        }
        imeSlike = imgName + "." + koncnica[1];
        
        const storageRef = ref(storage, "pfp/" + imeSlike);
        const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
        
    }

    const handleSaveUserData = async event => {
        event.preventDefault();
        try {
            await uploadImg();
            console.log(imeSlike);
            const imageRef = ref(storage, 'pfp/' + imeSlike);
            await saveUserData(name.current.value, imageRef, surname.current.value, username.current.value, email.current.value, tel.current.value);
            setIsSaved(true);
        } catch (error) {
            setIsError(true);
        }
    }
    const handleLogout = () => {
		signOutUser().then(() => {
			window.location.href = '/login';
		})
	}


    //select image for pfp
    function handleEvent(event) {
        if (event.type === "load") {
            myimg.src = reader.result;
        }
    }
    
    function addListeners(reader) {
        reader.addEventListener('loadstart', handleEvent);
        reader.addEventListener('load', handleEvent);
        reader.addEventListener('loadend', handleEvent);
        reader.addEventListener('progress', handleEvent);
        reader.addEventListener('error', handleEvent);
        reader.addEventListener('abort', handleEvent);
    }
    
    function handleSelected(e) {      
        const selectedFile = input.files[0];
        if (selectedFile) {
            addListeners(reader);
            imgName = selectedFile.name;
            reader.readAsDataURL(selectedFile);
        }
    }
    
    let user = props.userData;
    let imgName;
    var myimg;
    var input;
    var reader = new FileReader();
    let imeSlike;
    return(
        <div className="profile">
            <div className="profile-image">
                <img id="image" alt="Pfp-1" />
                <img className="overlay" src={imageOverlay} alt="overlay" />
                <input type="file"  id="fileInput" accept=".png,.jpg,.jpeg" name="profile" />
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

