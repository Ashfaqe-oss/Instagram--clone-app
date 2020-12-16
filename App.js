import React, { useState, useEffect } from "react";
import "./App.css";
import './Reels.css';
import Video from "./Video";
import Post from "./Post";
import { auth, db } from "./firebase";
import { Modal, Button, Input} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";
import ReelUpload from "./ReelUpload";
import Footer from "./Footer";
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import MovieFilterOutlinedIcon from '@material-ui/icons/MovieFilterOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}                            

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [reels, setReels] = useState(false);
  const [posts, setPosts] = useState([]);
  const [reelss, setReelss] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openReelModel, setOpenReelModel] = useState(false);


  //useEffect runs a piece of code based on a specific condition

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        //console.log(authUser);
        setUser(authUser);
      } else {
        //user logged out
        setUser(null);
      }
    });

    return () => {
      //perform some clean up action
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // every time a new post is added, this code fires up

        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    db.collection("reels")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      setReelss(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          reel: doc.data(),
        }))
      )
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

   const [show, handleShow] = useState( false );
    
    useEffect( () => {
        window.addEventListener( "scroll", () => {
            if ( window.scrollY > 310 ) {
                handleShow( true );
            } else handleShow( false );
        } );
        return () => {
            window.removeEventListener( "scroll", () => handleShow(false) );
        };
    }, [] );

  return (
    <div>
    {reels 
       ? 
     <div className="reels">
      <Modal
        open={openReelModel}
        onClose={() => setOpenReelModel(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <ReelUpload userName={user.displayName} />
      </Modal>
			<div className="reels__header">
        <Button onClick={() => setReels(false)}>
					<ArrowBackIosIcon />
        </Button>
        <div className="reels__headerCenter">
        <h3>
        Reels 
        </h3>
        <div className="reels__headerCenterButton">
        <Button onClick={() => setOpenReelModel(true)}>
					<AddBoxOutlinedIcon fontSize="large"/>
        </Button>
        </div>
        </div>
				<Button>
					<CameraAltOutlinedIcon />
				</Button>
			</div>
			<div className="reels__body">
				<div className="reels__videos">
				{reelss.map(({id, reel}) => (
          <Video 
          reelId={id}
          userName={reel.userName} 
          likes={reel.likes}
          caption={reel.caption}
          timestamp={reel.timestamp}
          videoUrl={reel.videoUrl} />
        ))
      }
      
        </div>
        
      </div>
      
		</div>
      : 
      <div className="App">

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper} id="signUp">
          <div className="app__signUpForm">
            <form className="app__signUp" onSubmit={signUp}>
              
                <img
                  className="signUp__headerImage"
                  src="https://www.vhv.rs/dpng/d/0-157_instagram-name-logo-png-transparent-png.png"
                  alt=""
                />

                <Input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                ></Input>

                <Input
                  placeholder="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>

                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Input>

                <Button type="submit">Create account for Free</Button>
            </form>
          </div>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper} id="signUp">
          <div className="app__signUpForm">
            <form className="app__signUp" onSubmit={signIn}>
              
                <img
                  className="signUp__headerImage"
                  src="https://www.vhv.rs/dpng/d/0-157_instagram-name-logo-png-transparent-png.png"
                  alt=""
                />

                <Input
                  placeholder="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>

                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Input>

                <Button type="submit">sign In</Button>
             
            </form>
          </div>
        </div>
      </Modal>

      <div className={`app__header1 ${show && 'notShow'}`}>
        <img
          className="app__headerImage"
          src="https://freepngimg.com/thumb/logo/76861-web-instagram-script-typeface-typography-font.png"
          alt=""
        />

        {user ? (
          <div className="app__loginContainer">
          <div className="app__loginContainerIcons">
          <Button className="reels" onClick={() => setReels(true)}><MovieFilterOutlinedIcon/></Button>
          <Button className="post" href="#uploadHere"><AddBoxOutlinedIcon/> </Button>
          </div>
          <Button className="logout" onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button
                className="signIn__up"
                style={{  border: '3px solid #cacaca', borderRadius: '10px', marginLeft: '15px' }}
                onClick={() => {
                setOpenSignIn(true);
                setEmail("");
                setPassword("");
              }}
            >
              Sign In
            </Button>
            <Button
              className="signIn__up"
              onClick={() => {
                setOpen(true);
                setUsername("");
                setEmail("");
                setPassword("");
              }}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
                    
      <h3 id="uploadHere">The Instagram Clone </h3>

      {user?.displayName ? (
        <ImageUpload  username={user.displayName} />
      ) : (
        <h6>We're Sorry but you need to login to Upload</h6>
      )}
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              likes={post.likes}
            />
          ))}
        </div>
        
      </div>
      <Footer />
    </div>
     }
    
    </div>
  );
}

export default App;

