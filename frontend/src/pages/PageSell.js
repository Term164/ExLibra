import React from 'react';
import '../css/PageSell.css';
import tempImg1 from '../images/temp-book.jpg';

export default function PageSell() {
  return (
    <div className="content-ps">
		<div className="left">
			<div className="book-image">
				<img src={tempImg1} />
				<input type="file" accept=".png,.jpg,.jpeg" name="profile" />
			</div>
		</div>
		<div className="right">
			<div className="line">
				<input type="text" placeholder="Naslov..." name="title" />
			</div>

			<div className="line">
				<select name="uni" id="uni" title="Univerza">
					<option value="uni1">Uni1</option>
					<option value="uni2">Uni2</option>
					<option value="uni3">Uni3</option>
					<option value="uni4">Uni4</option>
				</select>
			</div>

			<div className="line">
				<input type="text" name="subject" placeholder="Predmet..." />
			</div>

			<div className="line">
				<textarea placeholder="Opis..."></textarea>
			</div>
			
			<div className="line">
				<input type="number" name="price" placeholder="Cena..." />
			</div>
			
			<div className="line center">
				<button>Save</button>
			</div>

		</div>
	</div>
  )
}
