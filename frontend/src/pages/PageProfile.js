import React from 'react';
import '../css/PageProfile.css';
import UserProfile from '../components/userDataField';
import { getAllUserBooks, removeAdd } from '../Firebase';

export default class PageProfile extends React.Component {


	constructor(props){
		super(props);
		this.state = {userAds: [], selectedAdd: null};
	}

	async componentDidUpdate(prevProps){;
		if(!prevProps.userData && this.props.userData){
			this.setState({
				userAds: await getAllUserBooks(this.props.userData)
			});
		}
	}

	render() {
		let user = this.props.userData;
		
		function navigateSell(){
			window.location.href = "/sell";
		}

		const handleRemoveAdd = async () => {
			if(this.state.selectedAdd != null){
				await removeAdd(this.state.selectedAdd, user);
				this.setState({
					userAds: this.state.userAds.filter(add => add.aid !== this.state.selectedAdd)
				});
				this.setState({selectedAdd: null});
			}
		}

		const handleSelectAdd = (aid) => {
			if(this.state.selectedAdd === aid) this.setState({selectedAdd: null})
			else this.setState({selectedAdd: aid});
		}
				
		return (
			<div className="content-pp">
				<UserProfile userData = {user}/>
				<div className="books">
					<div className="wishlist-section section">
						<h2>Seznam želja</h2>
						<div className="book-area">
							<div className="scroll">
								
								<div className="item">
									<h3>Test Title 1</h3>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<h3>Test Title 2</h3>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<h3>Test Title 3</h3>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<h3>Test Title 4</h3>
									<p>This are the test tags</p>
								</div>

							</div>
		
						</div>
		
						<div className="options">
							<button>Dodaj</button>
							<button>Odstrani</button>
						</div>
		
					</div>
		
					<div className="bookshelf-section section">
						<h2>Tvoje knjige</h2>
						<div className="book-area">
							<div className="scroll">
								{
									
								this.state.userAds.map(Add =>{
									return <div key={Add.aid} 

										onClick={(e) => {
												handleSelectAdd(Add.aid);
												const item = e.currentTarget;
												const scroll = item.parentNode;
									
												let oldSelectedItem = scroll.selectedItem;
												if (oldSelectedItem != null) {
													oldSelectedItem.classList.remove('selected');
												}
												if (item === scroll.selectedItem) {
													scroll.selectedItem = null;
												} else {
													item.classList.add('selected');
													scroll.selectedItem = item;
												}
											}
										}
										
										className="item">
											
										<div className="upper">
											<div>
												<h4 className="sell">Prodajam</h4>
												<h3>{Add.knjiga.ime}</h3>
											</div>
											<h3>{Add.cena} €</h3>
										</div>
										<p>{Add.knjiga.faks.toString()}</p>
									</div>
								})}

							</div>
						</div>
		
						<div className="options">
							<button onClick={navigateSell}>Dodaj</button>
							<button onClick={handleRemoveAdd}>Odstrani</button>
						</div>
		
					</div>
		
				</div>
			</div>
		);
	}
}
