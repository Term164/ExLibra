import React from 'react';
import '../css/PageBooks.css';

export default function PageBooks() {
  return (
    <div className="content-pb">
		<div className="left">
			<h2>Filtri:</h2>
			<div className="filters">
				<div className="filter">
					<h3>Razvrsti po:</h3>
					<select name="order" id="order" title="order">
						<option value="costLow">Cena naraščajoča</option>
						<option value="costHigh">Cena padajoča</option>
						<option value="new">Novo</option>
						<option value="old">Staro</option>
					</select>
				</div>

				<div className="filter">
					<h3>Cena:</h3>
					<input type="range" name="cost" />
				</div>
				
				<div className="filter">
					<h3>Univerza:</h3>
					<input type="text" name="school" />
				</div>
				
				<div className="filter">
					<h3>Letnik:</h3>
					<input type="radio" id="html" name="fav_language" value="HTML" />
					<label >HTML</label>
					<input type="radio" id="css" name="fav_language" value="CSS" />
					<label >CSS</label>
					<input type="radio" id="javascript" name="fav_language" value="JavaScript" />
					<label >JavaScript</label>
				</div>
				
				<div className="filter">
					<h3>Predmet:</h3>
					<input type="text" name="className" />
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

				<div className="item">
					<img src="images/book-image.jpg" alt="b1" title="book-image-1" />
					<div className="info">
						<h3>Title of the book</h3>
						<h5>School, Year, className/subject</h5>
						<p>Description of the book and other information needed for it. Add whatevery you need.</p>
					</div>
					<div className="options">
						<h4>2,40 €</h4>
						<button>Kupi</button>
						<button>Kontakt</button>
					</div>
				</div>

				<div className="item">
					<img src="images/book-image-2.jpg" alt="b1" title="book-image-1" />
					<div className="info">
						<h3>Title of the book</h3>
						<h5>School, Year, className/subject</h5>
						<p>Description of the book and other information needed for it. Add whatevery you need.</p>
					</div>
					<div className="options">
						<h4>5,20 €</h4>
						<button>Kupi</button>
						<button>Kontakt</button>
					</div>
				</div>

				<div className="item">
					<img src="images/book-image-3.jpg" alt="b1" title="book-image-1" />
					<div className="info">
						<h3>Title of the book</h3>
						<h5>School, Year, className/subject</h5>
						<p>Description of the book and other information needed for it. Add whatevery you need.</p>
					</div>
					<div className="options">
						<h4>3,30 €</h4>
						<button>Kupi</button>
						<button>Kontakt</button>
					</div>
				</div>

				<div className="item">
					<img src="images/book-image.jpg" alt="b1" title="book-image-1" />
					<div className="info">
						<h3>Title of the book</h3>
						<h5>School, Year, className/subject</h5>
						<p>Description of the book and other information needed for it. Add whatevery you need.</p>
					</div>
					<div className="options">
						<h4>3,00 €</h4>
						<button>Kupi</button>
						<button>Kontakt</button>
					</div>
				</div>

				<div className="item">
					<img src="images/book-image.jpg" alt="b1" title="book-image-1" />
					<div className="info">
						<h3>Title of the book</h3>
						<h5>School, Year, className/subject</h5>
						<p>Description of the book and other information needed for it. Add whatevery you need.</p>
					</div>
					<div className="options">
						<h4>3,00 €</h4>
						<button>Kupi</button>
						<button>Kontakt</button>
					</div>
				</div>

				<div className="item">
					<img src="images/book-image.jpg" alt="b1" title="book-image-1" />
					<div className="info">
						<h3>Title of the book</h3>
						<h5>School, Year, className/subject</h5>
						<p>Description of the book and other information needed for it. Add whatevery you need.</p>
					</div>
					<div className="options">
						<h4>3,00 €</h4>
						<button>Kupi</button>
						<button>Kontakt</button>
					</div>
				</div>

				<div className="item">
					<img src="images/book-image.jpg" alt="b1" title="book-image-1" />
					<div className="info">
						<h3>Title of the book</h3>
						<h5>School, Year, className/subject</h5>
						<p>Description of the book and other information needed for it. Add whatevery you need.</p>
					</div>
					<div className="options">
						<h4>3,00 €</h4>
						<button>Kupi</button>
						<button>Kontakt</button>
					</div>
				</div>



			</div>
		</div>
	</div>
  )
}
