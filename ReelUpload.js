import React, { useState } from 'react';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ReelUpload.css';

export default function ReelUpload({ userName }) {
	const [ caption, setCaption ] = useState('');
	const [ reel, setReel ] = useState(null);
	const [ progress, setProgress ] = useState(0);
	const [disabled, setDisabled] = useState(true)

	const handleChange = (event) => {
		if (event.target.files[0]) {
			setReel(event.target.files[0]);
			setDisabled(false);
		}
	};

	const handleUpload = () => {
		const uploadTask = storage.ref(`reels/${reel?.name}`).put(reel);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// progress function ...
				const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
				setProgress(progress);
			},
			(error) => {
				//error function
				console.log(error);
			},
			() => {
				//complete function...
				storage.ref('reels').child(reel?.name).getDownloadURL().then((url) => {
					//post image inside db
					db.collection('reels').add({
						timestamp: firebase.firestore.FieldValue.serverTimestamp(),
						caption: caption,
						videoUrl: url,
						userName: userName,
						likes: 0
					});

					setProgress(0);
					setReel(null);
					setCaption('');
					
				});
			}
		);
	};


	return (
		<div className="reelUpload">
			<h4>Upload Reels Video</h4>
			<progress className="reelUpload__progress" value={progress} max="100" />
			<input
				type="text"
				className="reel__inputText"
				value={caption}
				onChange={(event) => setCaption(event.target.value)}
				placeholder="Enter a caption... and choose a video"
			/>
			<input className="reelUpload__Chooser" type="file" accept="video/*" onChange={handleChange} />
			<button className="reelUpload__button" disabled={disabled} onClick={handleUpload}>
				Upload
			</button>
			
		</div>
	);
}
