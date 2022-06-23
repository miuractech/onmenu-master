import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import firebase from '../../firebaseConfig';
import { setUser } from './authSlice';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

var provider = new firebase.auth.GoogleAuthProvider();
const schema = yup.object({
    name: yup.string().email().required(),
    password: yup.string().required(),
}).required()
export default function Auth() {
    const dispatch = useDispatch()
    const { register, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
      });
    const [warn, setWarn] = useState(false)
      const onSubmit = () => {
        //   firebase.auth().signInWithEmailAndPassword(
        //     data.name,
        //     data.password
        //   )
        //   .then((userCredential) => {
        //     // Signed in 
        //     var user = userCredential.user;
        //     dispatch(setUser(user))
        //     // ...
        //   })
        //   .catch((error) => {
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        //     // ..
        //   });

        firebase.auth()
        .signInWithPopup(provider)
          .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            if(user.uid === 'y6oVFkyeugVpIDwNlqhZVbiz9Xx2'){
                dispatch(setUser(user))
            }
            else{
                setWarn(true)
            }
            // ...
          })
          .catch((error) => {
              console.log(error);
          });
      };
    return (
        <div>
            {/* <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="email"
                    {...register('name')}
                    />
                </div>
                <div>
                    <input 
                    type="password" 
                    className="auth-input" 
                    placeholder="password"
                    {...register('password')}
                    />
                </div>
                <input type="submit" />
            </form> */}
            <div
            style={{width:'100%', height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}
            >
                <div>
                    <Button 
                    variant='contained'
                    color='primary'
                    onClick={onSubmit}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
            <Snackbar open={warn} autoHideDuration={6000} onClose={()=>setWarn(false)}>
                <Alert onClose={()=>setWarn(false)} severity="warning" >
                    You're not authorized
                </Alert>
            </Snackbar>
        </div>
    )
}
