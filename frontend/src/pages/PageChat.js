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
				const params = new URLSearchParams(window.location.search);
				loadMessagesAndListenToChanges(params.get("chatId"));
			}
		}
		getData();
	},[user]);

	const addNewMessage = (message) =>{
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
				return <div key={doc.username} onClick={(e) => {
					loadMessagesAndListenToChanges(doc.gid);

					const item = e.currentTarget;
					const scroll = item.parentNode;
		
					let oldSelectedItem = scroll.selectedItem;
					if (item != scroll.selectedItem && oldSelectedItem != null) {
						oldSelectedItem.classList.remove('selected');
					}
					if (item != scroll.selectedItem) {
						item.classList.add('selected');
						scroll.selectedItem = item;
					}

				}} className="user">
					<img src={doc.url} alt="u1" />
					<h3>{doc.username}</h3>
				</div>
			});
		}else{
			return <></>;
		}
	}
	
	const scrollAreaRef = useRef(null);
	const messagesRef = useRef(null);
	const scrollBarRef = useRef(null);
	const barHandleRef = useRef(null);

	const scrollChatInfo = {isDown: false, dowPos: 0, scrollNumber: 0};

	function updateScrollHeight() {
		var p = scrollAreaRef.current.clientHeight / messagesRef.current.clientHeight;
		if(p < 1) {
			var newHeight = p * scrollAreaRef.current.clientHeight;
			scrollBarRef.current.style.display = "block";
			barHandleRef.current.style.height = newHeight + "px";
		} else {
			scrollBarRef.current.style.display = "none";
		}
	}

	function scrollChat(move) {
		if(messagesRef.current.clientHeight < scrollAreaRef.current.clientHeight) {
			return;
		}
		if(move < 0) {
			if(scrollChatInfo.scrollNumber + move <= 0) {
				scrollChatInfo.scrollNumber = 0;
			} else {
				scrollChatInfo.scrollNumber += move;
			}
		} else {
			if(scrollChatInfo.scrollNumber + move > scrollAreaRef.current.clientHeight - barHandleRef.current.clientHeight) {
				scrollChatInfo.scrollNumber = scrollAreaRef.current.clientHeight - barHandleRef.current.clientHeight;
			} else {
				scrollChatInfo.scrollNumber += move;
			}
		}
		updateMessagesMove();
	}

	function updateMessagesMove() {
		let p = scrollChatInfo.scrollNumber / (scrollAreaRef.current.clientHeight - barHandleRef.current.clientHeight);
		messagesRef.current.style.bottom = (-p * (messagesRef.current.clientHeight - scrollAreaRef.current.clientHeight)) + "px";
		barHandleRef.current.style.bottom = scrollChatInfo.scrollNumber + "px";
	}

	function deselect() {
		if (window.getSelection) {
			if (window.getSelection().empty) {
				window.getSelection().empty();
			} else if (window.getSelection().removeAllRanges) {
				window.getSelection().removeAllRanges();
			}
		} else if (document.selection) {
			document.selection.empty();
		}
	}



	
	const usersRef = useRef(null);
	const usersAreaRef = useRef(null);
	const scrollUsersInfo = {usersNumber: 0};



	useEffect(() => {
		updateScrollHeight();
		const resizeEvent = () => {
			updateScrollHeight();
		};

		window.addEventListener('resize', resizeEvent);

		const barHandleMouseDown = (e) => {
			scrollChatInfo.isDown = true;
			scrollChatInfo.dowPos = e.clientY;
		};
		const scrollAreaWheel = (e) => {
			scrollChat(e.deltaY * -0.3);
		};
		const documentMouseUp = (e) => {
			scrollChatInfo.isDown = false;
		};
		const documentMouseMove = (e) => {
			if(scrollChatInfo.isDown) {
				deselect();
				var diff = scrollChatInfo.dowPos - e.clientY;
				scrollChat(diff);
				scrollChatInfo.dowPos = e.clientY;
			}
		};

		barHandleRef.current.addEventListener('mousedown', barHandleMouseDown);
		scrollAreaRef.current.addEventListener('wheel', scrollAreaWheel);
		document.addEventListener('mouseup', documentMouseUp);
		document.addEventListener('mousemove', documentMouseMove);


		const scrollUsersArea = (e) => {
			if(usersRef.current.clientHeight < usersAreaRef.current.clientHeight) {
				return;
			}

			scrollUsersInfo.usersNumber += e.deltaY * 0.3;
			if(scrollUsersInfo.usersNumber <= 0) {
				scrollUsersInfo.usersNumber = 0;
			} else if(scrollUsersInfo.usersNumber >= usersRef.current.clientHeight - usersAreaRef.current.clientHeight) {
				scrollUsersInfo.usersNumber = usersRef.current.clientHeight - usersAreaRef.current.clientHeight;
			}
			usersRef.current.style.top = (-scrollUsersInfo.usersNumber) + "px";
		};

		usersAreaRef.current.addEventListener('wheel', scrollUsersArea);


		return () => {
			window.removeEventListener('resize', resizeEvent);

			barHandleRef.current.removeEventListener('mousedown', barHandleMouseDown);
			scrollAreaRef.current.removeEventListener('wheel', scrollAreaWheel);
			document.removeEventListener('mouseup', documentMouseUp);
			document.removeEventListener('mousemove', documentMouseMove);

			usersAreaRef.current.removeEventListener('wheel', scrollUsersArea);

		};

	});



	return (
		<div className="content-pc">
			<div className="left">
				<div className="container">
					<div  id="scroll-area" ref={scrollAreaRef}>
						<div id="messages" ref={messagesRef}>
						{
							messages.map(msg =>{
								const me = msg.sentBy === user.username ? "me" : "";
								const classes = `message ${me}`;
								const extract = date => date.toISOString().split(/[^0-9]/).slice(0, -1);
								const date = extract( msg.sentAt ? new Date(msg.sentAt.seconds * 1000) : new Date(Date.now()));
								
								return <div key={msg.id} className={classes}>
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

					<div id="scrollbar" ref={scrollBarRef}>
						<div id="bar-handle" ref={barHandleRef}></div>
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

				<div ref={usersAreaRef} id="users-display">

					<div ref={usersRef} id="users">
						{renderUsers()}
					</div>

				</div>

			</div>
		</div>
	)
}
