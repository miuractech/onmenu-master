import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { BrowserRouter,Switch,Route } from 'react-router-dom';
import Auth from './features/auth';
import firebase from './firebaseConfig';
import { useDispatch } from 'react-redux';
import { selectAuth, setUser } from './features/auth/authSlice';
import { useSelector } from 'react-redux';
import AddRestaurant from './features/restaurants/addRestaurant';
import { Backdrop, CircularProgress } from '@material-ui/core';
import TopBar from './features/components/topbar';
import Restaurant from './features/restaurants/restaurants';
import Index from './features/restaurants/restaurantnew';

function App() {
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if(user && user.uid === 'y6oVFkyeugVpIDwNlqhZVbiz9Xx2'){
        dispatch(setUser(user))
      }else{
        dispatch(setUser(null))
        firebase.auth().signOut()
      }

     });
  }, [])

  if(auth.status === 'loading'){
    return(
      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={auth.status === 'loading'}
      // onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    )
  }
    
  return (
    <div className="App">
      <BrowserRouter>
          {auth.user?
            <div>
              <TopBar />
              <Switch>
                <Route path="/edit/:id" >
                  <AddRestaurant editMode={true} />
                </Route>
                <Route exact path="/add" component={AddRestaurant} />
                <Route exact path="/" component={Index} />
              </Switch>
            </div>
            :
            <Auth />
          }
      </BrowserRouter>
    </div>
  );
}

export default App;
