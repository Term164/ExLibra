import React from 'react';
import '../css/PageChat.css';

export default function PageChat() {
  return (
    <div className="content-pc">
		<div className="left">

			<div className="container">
				<div  id="scroll-area">
				
					<div id="messages">

						<div className="message">
							<div className="label">
								<h4>Alan</h4>
								<h5>22/11/20 18:36</h5>
							</div>
							<p>What are you doing?</p>
						</div>

						<div className="message me">
							<div className="label">
								<h4>Jaz</h4>
								<h5>22/11/20 19:01</h5>
							</div>
							<p>Nothing much?</p>
						</div>

						<div className="message">
							<div className="label">
								<h4>Alan</h4>
								<h5>22/11/20 19:53</h5>
							</div>
							<p>I'm not doing anything really.</p>
						</div>

						<div className="message">
							<div className="label">
								<h4>Alan</h4>
								<h5>22/11/20 19:55</h5>
							</div>
							<p>Please stop messaging me!</p>
						</div>

						<div className="message me">
							<div className="label">
								<h4>Jaz</h4>
								<h5>22/11/20 20:00</h5>
							</div>
							<p>NO!</p>
						</div>

					</div>

				</div>

				<div id="scrollbar">
					<div id="bar-handle"></div>
				</div>

			</div>

			<div className="input">
				<input type="text" name="message" title="message" placeholder="Sporočilo..." />
				<input type="submit" value="Pošlji" />
			</div>
		</div>
		<div className="right">
			<h2>Uporabniki:</h2>

			<div id="users-display">

				<div id="users">

					<div className="user">
						<img src="images/pfp1.jpg" alt="u1" />
						<h3>Alan</h3>
					</div>
					
					<div className="user">
						<img src="images/pfp2.png" alt="u1" />
						<h3>Janez</h3>
					</div>
					
					<div className="user">
						<img src="images/pfp3.jpg" alt="u1" />
						<h3>Riko</h3>
					</div>

				</div>

			</div>

		</div>
	</div>
  )
}
