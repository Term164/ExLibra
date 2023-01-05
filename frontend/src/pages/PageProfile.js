import React from 'react';
import '../css/PageProfile.css';
import tempImg1 from '../images/pfp1.jpg';
import imageOverlay from '../images/upload-image.png';

export default function PageProfile() {
  return (
    <div className="content-pp">
		<div className="profile">

			<div className="profile-image">
				<img src={tempImg1} alt="Pfp-1" />
				<img className="overlay" src={imageOverlay} alt="overlay" />
				<input type="file" accept=".png,.jpg,.jpeg" name="profile" />
			</div>
			<div className="profile-info">
				<div className="line">
					<h3>Ime:</h3>
					<input type="text" name="name" value="Alan" />
				</div>

				<div className="line">
					<h3>Vzdevek:</h3>
					<input type="text" name="username" value="alan01" />
				</div>

				<div className="line">
					<h3>Email:</h3>
					<input type="email" name="email" value="lampe.alan@gmail.com" />
				</div>

				<div className="line">
					<h3>Telefon:</h3>
					<input type="tel" name="phone" value="" />
				</div>

				<div className="line">
					<h3>Kraj:</h3>
					<input type="text" name="location" value="Ljubljana" />
				</div>
			</div>
			<div className="options">
				<button>Logout</button>
				<input type="button" name="save" value="Save" />
			</div>
			
		</div>
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
					<button>Dodaj</button>
					<button>Odstrani</button>
				</div>

			</div>

		</div>
	</div>
  )
}
