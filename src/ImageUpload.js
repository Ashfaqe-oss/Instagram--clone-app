import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles( ( theme ) => ( {
	button: {
		margin: theme.spacing( 1 )
	}
} ) );

export default function ImageUpload ( { username } ) {
	const classes = useStyles();
	const [caption, setCaption] = useState( '' );
	const [image, setImage] = useState( null );
	const [progress, setProgress] = useState( 0 );
	const [disabled, setDisabled] = useState( true );

	const handleChange = ( event ) => {
		if ( event.target.files[0] ) {
			setImage( event.target.files[0] );
			setDisabled( false );
		}
	};

	const handleUpload = () => {
		const uploadTask = storage.ref( `images/${ image?.name }` ).put( image );

		uploadTask.on(
			'state_changed',
			( snapshot ) => {
				// progress function ...
				const progress = Math.round( snapshot.bytesTransferred / snapshot.totalBytes * 100 );
				setProgress( progress );
			},
			( error ) => {
				//error function
				console.log( error );
				alert( error.message );
			},
			() => {
				//complete function...
				storage.ref( 'images' ).child( image?.name ).getDownloadURL().then( ( url ) => {
					//post image inside db
					db.collection( 'posts' ).add( {
						timestamp: firebase.firestore.FieldValue.serverTimestamp(),
						caption: caption,
						imageUrl: url,
						username: username,
						likes: 0
					} );

					setProgress( 0 );
					setCaption( '' );
					setImage();
				} );
			}
		);
	};

	return (
		<div className="image__upload">
			<progress className="imageupload__progress" value={progress} max="100" />
			<input
				type="text"
				className="caption__inputText"
				value={caption}
				onChange={( event ) => setCaption( event.target.value )}
				placeholder="Enter a caption... and choose a pic"
			/>
			<input className="input__imagechooser" type="file" onChange={handleChange} />

			<Button
				variant="outlined"
				color="primary"
				className={classes.button}
				id="upload"
				startIcon={<CloudUploadIcon />}
				onClick={handleUpload}
				disabled={disabled}
			>
				Upload
			</Button>
		</div>
	);
}
