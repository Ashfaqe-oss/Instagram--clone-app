import firebase from 'firebase';

const firebaseApp = firebase.initializeApp( {
	apiKey: "AIzaSyB6lEaOxalYrPnqnaBOuvgaqjNfRd22XFQ",
	authDomain: "ig-clone-ll.firebaseapp.com",
	projectId: "ig-clone-ll",
	storageBucket: "ig-clone-ll.appspot.com",
	messagingSenderId: "1085424840641",
	appId: "1:1085424840641:web:b4e1398b691757446cc940",
	measurementId: "G-043PG88VZP"
} );

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
