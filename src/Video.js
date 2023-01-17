import React, { useState, useRef } from 'react';
import './Video.css';
import { IconButton, Avatar } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Ticker from 'react-ticker';

function Video ( { userName, likes, videoUrl, timestamp, caption, reelId } ) {
	const [playing, setPlaying] = useState( false );
	const [like, setLike] = useState( false );
	const videoRef = useRef( null, { passive: true } );

	const handlePlay = () => {
		if ( playing ) {
			videoRef.current.pause();
			setPlaying( false );
		} else {
			videoRef.current.play();
			setPlaying( true );
		}
	};

	return (
		<div className="videoCard">
			<video
				ref={videoRef}
				onClick={handlePlay}
				className="videoCard__player"
				loop
				src={videoUrl}
				alt="Reels video"
			/>
			<div className="videoCard__bottom">
				<div className="videoCard__bottomDetails">
					<div className="__bottomDetailsUser">
						<Avatar src={videoUrl} style={{ height: '29px', width: '27px', paddingLeft: '1px' }} />
						<h5>{userName}</h5>
					</div>
					<div className="__bottomDetailsCaption">
						{like ? (
							<IconButton>
								<FavoriteIcon onClick={() => setLike( false )} style={{ color: 'red' }} />
							</IconButton>
						) : (
								<IconButton>
									<FavoriteIcon onClick={() => setLike( true )} style={{ color: 'lightgray' }} />
								</IconButton>
							)}
						<Ticker mode='await'>
							{( { index } ) => (
								<>
									<p>{caption}</p>
								</>
							)}
						</Ticker>

					</div>
				</div>
			</div>
		</div>
	);
}

export default Video;
