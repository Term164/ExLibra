import React from 'react';
import '../css/PageProfile.css';
import UserProfile from '../components/userDataField';

export default class PageProfile extends React.Component {

	render(){
		let user = this.props.userData;
		function navigateSell(){
			window.location.href = "/sell";
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
								
								<div className="item">
									<h3>Test Title 5</h3>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<h3>Test Title 6</h3>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<h3>Test Title 7</h3>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<h3>Test Title 8</h3>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<h3>Test Title 9</h3>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<h3>Test Title 10</h3>
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
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="own">Imam</h4>
											<h3>Test Title 1</h3>
										</div>
									</div>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="sell">Podajam</h4>
											<h3>Test Title 2</h3>
										</div>
										<h3>3,50 €</h3>
									</div>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="sell">Podajam</h4>
											<h3>Test Title 3</h3>
										</div>
										<h3>3,50 €</h3>
									</div>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="sell">Podajam</h4>
											<h3>Test Title 4</h3>
										</div>
										<h3>3,50 €</h3>
									</div>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="sell">Podajam</h4>
											<h3>Test Title 5</h3>
										</div>
										<h3>3,50 €</h3>
									</div>
									<p>This are the test tags</p>
								</div>
		
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="own">Imam</h4>
											<h3>Test Title 6</h3>
										</div>
									</div>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="own">Imam</h4>
											<h3>Test Title 7</h3>
										</div>
									</div>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="own">Imam</h4>
											<h3>Test Title 8</h3>
										</div>
									</div>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="sell">Podajam</h4>
											<h3>Test Title 9</h3>
										</div>
										<h3>3,50 €</h3>
									</div>
									<p>This are the test tags</p>
								</div>
								
								<div className="item">
									<div className="upper">
										<div>
											<h4 className="sell">Podajam</h4>
											<h3>Test Title 10</h3>
										</div>
										<h3>3,50 €</h3>
									</div>
									<p>This are the test tags</p>
								</div>
		
							</div>
						</div>
		
						<div className="options">
							<button onClick={navigateSell}>Dodaj</button>
							<button>Odstrani</button>
						</div>
		
					</div>
		
				</div>
			</div>
		);
	}
}
