import React from 'react';
import '../css/PageSell.css';
import tempImg1 from '../images/temp-book.jpg';
import { getBooks, addOglas}  from '../Firebase.js';

export default class PageSell extends React.Component {

	state = {
		books: {},
		selectedBookValue: '',
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



		const listBooks = [];

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

		return (
			<div className="content-ps">
				<div className="left">
					<div className="book-image">
						<img src={tempImg1} alt="sell" />
						<input type="file" accept=".png,.jpg,.jpeg" name="profile" />
					</div>
				</div>
				<div className="right">
					<div className="line">
						<select name="knjiga" id="knjiga" title="Knjiga" onChange={this.handleChangeBook} >
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
						<textarea id="opis" placeholder="Opis..."></textarea>
					</div>
					
					<div className="line">
						<input id="cena" type="number" name="price" placeholder="Cena..." />
					</div>
					
					<div className="line center">
						<button onClick={addOglas}>Save</button>
					</div>

				</div>
			</div>
		)
	}
}
