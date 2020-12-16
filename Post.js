import React, { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import './Post.css';
import { db } from './firebase';
import firebase from 'firebase';
import FavoriteIcon from '@material-ui/icons/Favorite';

function Post({ postId, user, username, caption, imageUrl, likes }) {
	const [ comments, setComments ] = useState([]);
	const [ comment, setComment ] = useState('');
	const [ like, setLike ] = useState(false);
	const increment = firebase.firestore.FieldValue.increment(1);
	const decrement = firebase.firestore.FieldValue.increment(-1);

	useEffect(
		() => {
			let unsubscribe;
			if (postId) {
				unsubscribe = db
					.collection('posts')
					.doc(postId)
					.collection('comments')
					.orderBy('timestamp', 'desc')
					.onSnapshot((snapshot) => {
						setComments(snapshot.docs.map((doc) => doc.data()));
					});
			}
			return () => {
				unsubscribe();
			};
		},
		[ postId ]
	);

	const postComment = (event) => {
		event.preventDefault();

		db.collection('posts').doc(postId).collection('comments').add({
			text: comment,
			username: user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp()
		});

		setComment('');
	};

	const likeFunction = () => {
		setLike(true);

		db.collection('posts').doc(postId).update({
			likes: increment
		});
	};

	const disLikeFunction = () => {
		setLike(false);

		db.collection('posts').doc(postId).update({
			likes: decrement
		});
	};

	return (
		<div className="post">
			<div className="post__header">
				{/* header => avatar + username */}

				<Avatar className="post__avatar" alt="AshfaqeAhmed" src={imageUrl} />

				<h3 className="post__headerusername">{username}</h3>
			</div>

			{/* Image */}

			{imageUrl && <img className="post__image" src={imageUrl} alt="" />}
			{likes !== 0 && (
				<h5>
					{likes} {likes === 1 ? 'like' : 'likes'}
				</h5>
			)}

			{/* username + caption */}

			<h4 className="post__text">
				<strong>{username}</strong> {caption}
			</h4>

			<div className="post__comments">
				{comments.map((comment) => (
					<p>
						<strong>{comment.username}</strong> {comment.text}
					</p>
				))}
			</div>

			{user && (
				<form
					className="post__commentbox"
					onSubmit={postComment}
					style={{ backgroundColor: 'rgb(75, 74, 74)' }}
				>
					{like ? (
						<IconButton onClick={disLikeFunction} style={{ backgroundColor: 'rgb(75, 74, 74)' }}>
							<FavoriteIcon style={{ color: 'rgb(243, 10, 182)', backgroundColor: 'rgb(75, 74, 74)' }} />
						</IconButton>
					) : (
						<IconButton onClick={likeFunction} style={{ backgroundColor: 'rgb(75, 74, 74)' }}>
							<FavoriteIcon style={{ color: 'white' }} />
						</IconButton>
					)}

					<input
						className="post__input"
						type="text"
						placeholder="Add a comment..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button variant="outlined" className="post__button" type="submit" disabled={!comment}>
						Post
					</button>
				</form>
			)}
		</div>
	);
}

export default Post;
