import React from 'react';
import '../css/PageBooks.css';
import Footer from '../Footer';
import { createNewChatGroup, getOglas, getPredmetiInFakultete}  from '../Firebase.js';
import { SpinningCircles  } from 'react-loading-icons'

export default class PageBooks extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		  books: []
		};
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	async componentDidMount() {
		this.setState({books: []});
		const books = await getOglas();
		this.setState({ books });
	}
	

	arrayToDisplay(array, separator) {
		return array.join(separator);
	}

	getYearDisplay(seconds) {
		const date = new Date(seconds * 1000);
		return date.getFullYear();
	}

	render() {
		
		let user = this.props.userData;

		const results = [];

		async function createNewContact(uid){
			let gid = await createNewChatGroup(user, uid);
			window.location.href = `/chat?chatId=${gid}`;
		}

		for(const book of this.state.books) {//book.slika TODO need to use this
			results.push(
				<div key={book.id} className="item">
					<img src={book.slika} alt={"book-" + book.id} />
					<div className="info">
						<h3>{book.ime}</h3>
						<h5>{this.arrayToDisplay(book.faksi, '/')}, {this.getYearDisplay(book.time)}, {this.arrayToDisplay(book.predmeti, '/')}</h5>
						<p>{book.opis}</p>
					</div>
					<div className="options">
						<h4>{book.cena} €</h4>
						<button onClick={() => {
							createNewContact(book.uid);
						}}>Kontakt</button>
					</div>
				</div>
			);
		}
		window.onload = (event) => {
			spremeniCeno();
			getPredmetiInFakultete();
		};
		function spremeniCeno(){
			document.getElementById("maxcena").innerHTML=document.getElementById("maxPrice").value;
		}

		return (
			<>
			<div className="content-pb">
				<div className="left">
					<h2>Filtri:</h2>
					<div className="filters">
						<div className="filter">
							<h3>Razvrsti po:</h3>
							<select  name="order" id="order" title="order">
								<option value="costLow">Cena naraščajoča</option>
								<option value="costHigh">Cena padajoča</option>
								<option value="new">Novo</option>
								<option value="old">Staro</option>
							</select>
						</div>

						<div className="filter">
							<div>
								<h3>Cena:</h3>
								<h3 id='maxcena'>50</h3>
							</div>
							<input id="maxPrice" onChange={spremeniCeno}  type="range" min={10} max={200} name="cost" />
						</div>
						
						<div className="filter">
							<h3>Univerza:</h3>
							<div>
								<input className="fakultete" type="checkbox" id="FRI" name="uni" value="FRI"/>
								<label >FRI</label>
							</div>
							<div>
								<input className="fakultete" type="checkbox" id="FMF" name="uni" value="FMF" />
								<label >FMF</label>
							</div>
							<div>
								<input className="fakultete" type="checkbox" id="EF" name="uni" value="EF" />
								<label >EF</label>
							</div>
							<div>
								<input className="fakultete" type="checkbox" id="FE" name="uni" value="FE" />
								<label >FE</label>
							</div>
						</div>
						
						<div className="filter">
							<h3>Predmet:</h3>
							<div>
								<input className="predmeti" type="checkbox" id="mat1" name="uni" value="mat1" />
								<label >mat1</label>
							</div>
							<div>
								<input className="predmeti" type="checkbox" id="oma1" name="uni" value="oma1" />
								<label >oma1</label>
							</div>
						</div>
						
						<div className="filter">
							<button id="shrani" onClick={this.componentDidMount}>Shrani</button>
						</div>
						
					</div>
					

				</div>
				<div className="right">
					<div className="utils">
						<div className="search">
							<input type="text" name="search" title="search" placeholder="Iskanje..." />
							<input type="submit" value="Išči" />
						</div>
					</div>
					<div className="items">

						{results.length === 0 ? <div className='loading'><span className='spinner'><SpinningCircles/></span></div> : results}
					</div>
				</div>
			</div>
			<Footer />
			</>
		)
	}
}
