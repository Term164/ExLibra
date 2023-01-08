import React from 'react';
import '../css/PageSell.css';
import tempImg1 from '../images/temp-book.jpg';
import { getBooks, addOglas, saveAddImage}  from '../Firebase.js';
import {CgCloseR} from 'react-icons/cg';
import { SpinningCircles } from 'react-loading-icons'

export default class PageSell extends React.Component {

	constructor(props){
		super(props)
		this.desc = React.createRef();
		this.price = React.createRef();
		this.bid = React.createRef();
		this.input = React.createRef();
	}

	state = {
		books: {},
		selectedBookValue: '',
		isSaved: false,
		isError: false,
		isLoading: false,
		errorMessage: null
	}

	async componentDidMount() {
		const books = await getBooks();
		this.setState({ books });
	}

	handleChangeBook = (event) => {
		this.setState({ selectedBookValue: event.target.value });

	};

	arrayToDisplay(array, separator) {
		return array.join(separator);
	}

	render() {
		const handleNotificationClick = event =>{
			this.setState({
				isSaved: false,
				isError: false
			});
		}

		let savedConfirmation = <div className='notification sucess fadeInElement'><h2>Nov oglas uspešno ustvarjen!</h2><button onClick={handleNotificationClick}><CgCloseR/></button></div>
		let errorMessage

		if (this.state.errorMessage != null){
			 errorMessage = <div className='notification error fadeInElement'><h2>{this.state.errorMessage}</h2><button onClick={handleNotificationClick}><CgCloseR/></button></div>;
		}

		let myimg;
    	let input;
		let reader = new FileReader();
		const listBooks = [];

		async function uploadImg(){
			input = document.getElementById("fileInput");
			let imgToUpload = input.files[0];
			let url = await saveAddImage(imgToUpload);
			return url;
		}

		const saveAdd = async event => {
			event.preventDefault();
			handleNotificationClick();
			input = document.getElementById("fileInput");
			if(input.files.length < 1){
				this.setState({isError: true, errorMessage: "Ni izbrane slike oglasa!"});
				return;
			}
			try {
				this.setState({isLoading: true});
				let imageUrl = await uploadImg();
				await addOglas(this.desc.current.value, this.price.current.value, this.bid.current.value, imageUrl);
				this.setState({isLoading: false, isSaved: true});
			} catch (error) {
				this.setState({isLoading: false, isError: true, errorMessage: "Prišlo je do napake pri ustvarjanju oglasa!"});
				console.error(error);
			}
		}

		for (const bookId in this.state.books) {
			const bookData = this.state.books[bookId];
			listBooks.push(
				<option key={bookId} value={bookId}>{bookData.ime}</option>
			);
		}

		let selectedBookUnis = "";
		let selectedBookSubs = "";
		let selectedBook = this.state.books[this.state.selectedBookValue];
		if(selectedBook != null) {
			selectedBookUnis = this.arrayToDisplay(selectedBook.faksi, ',');
			selectedBookSubs = this.arrayToDisplay(selectedBook.predmeti, ',');
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

		return (
			<div className="content-ps">
				<div className="left">
					<div className="book-image">
						<img id='image' src={tempImg1} alt="sell" />
						<input ref={this.input} type="file" id="fileInput" accept=".png,.jpg,.jpeg" name="profile" />
					</div>
				</div>
				<div className="right">
					<div className="line">
						<select name="knjiga" ref={this.bid}  id="knjiga" title="Knjiga" onChange={this.handleChangeBook} >
							<option value="none">Izberi</option>
							{listBooks}
						</select>
					</div>

					<div className="line">
						<input type="text" name="uni" placeholder="Predmet..." value={selectedBookUnis} readOnly />
					</div>

					<div className="line">
						<input type="text" name="subject" placeholder="Predmet..." value={selectedBookSubs} readOnly />
					</div>

					<div className="line">
						<textarea id="opis" ref={this.desc} placeholder="Opis..."></textarea>
					</div>
					
					<div className="line">
						<input id="cena" ref={this.price} type="number" name="price" placeholder="Cena..." />
					</div>
					
					<div className="line center">
						<button onClick={saveAdd}>Save</button>
					</div>	
					{this.state.isLoading && <span className='loading'><SpinningCircles className='spinner'/></span> }
				</div>
				{this.state.isError && errorMessage}
				{this.state.isSaved && savedConfirmation}
			</div>
		)
	}
}
