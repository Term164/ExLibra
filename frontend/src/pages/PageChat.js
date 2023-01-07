import React, { useEffect, useRef, useState } from 'react';
import '../css/PageChat.css';
import { loadMessages, saveMessage, getListOfAllChats } from '../Firebase';

export default function PageChat(props) {

	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [gid, setGid] = useState(null);
	const message = useRef();

	let user = props.userData;

	useEffect(() =>{
		async function getData(){
			if(user){
				const array = await getListOfAllChats(user);
				setUsers(array);
			}
		}
		getData();

	},[user]);

	const addNewMessage= (message) =>{
		setMessages((t)=>[...t,message]);
	}

	const saveUserMessage = (e) => {
		e.preventDefault();
		if(message.current.value !== ""){
			saveMessage(gid, user.username, message.current.value);
			message.current.value = "";
		}
	}

	function loadMessagesAndListenToChanges(gid){
		setMessages([]);
		setGid(gid);
		loadMessages(gid, addNewMessage);
	}

	function renderUsers(){
		if(users){
			return users.map(doc => {
				return <div key={doc.username} onClick={() => {loadMessagesAndListenToChanges(doc.gid)}} className="user"><img src={doc.url} alt="u1" /><h3>{doc.username}</h3></div>
			});
		}else{
			return <></>;
		}
	}


	return (
		<div className="content-pc">
			<div className="left">
				<div className="container">
					<div  id="scroll-area">
						<div id="messages">
						{
							messages.map(msg =>{
								const me = msg.sentBy === user.username ? "me" : "";
								const classes = `message ${me}`;
								const extract = date => date.toISOString().split(/[^0-9]/).slice(0, -1);
								const date = extract( msg.sentAt ? new Date(msg.sentAt.seconds * 1000) : new Date(Date.now()));
								
								return <div key={msg.sentAt} className={classes}>
											<div className="label">
												<h4>{msg.sentBy === user.username ? "Jaz" : msg.sentBy}</h4>
												<h5>{`${date[0]}/${date[1]}/${date[2]} ${date[3]}:${date[4]}`}</h5>
											</div>
											<p>{msg.messageText}</p>
										</div>
							})
						}
						</div>

					</div>

					<div id="scrollbar">
						<div id="bar-handle"></div>
					</div>

				</div>

				<div className="input">
					<form onSubmit={saveUserMessage}>
						<input ref={message} type="text" name="message" title="message" placeholder="Sporočilo..." />
						<input type="submit" value="Pošlji"/>
					</form>
				</div>
			</div>
			<div className="right">
				<h2>Uporabniki:</h2>

				<div id="users-display">

					<div id="users">
						{renderUsers()}
					</div>

				</div>

			</div>
		</div>
	)
}
