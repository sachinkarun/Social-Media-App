import * as types from './constant';
import app from '../Firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from 'firebase/auth';
import {getFirestore, setDoc, doc } from 'firebase/firestore';

const registerStart = () => ({
    type: types.REGISTER_START
});

export const registerSuccess = (user) => ({
    type: types.REGISTER_SUCCESS,
    payload: user
});
/*
export const registerSuccess1 = (user) => {
    return function (dispatch){
        createUserWithEmailAndPassword(auth, email, password)
        .then(({user}) => {
            dispatch({type: types.REGISTER_SUCCESS,payload: user})
        })
        .catch((err) =>{
            dispatch({type: types.REGISTER_SUCCESS,payload: err})
        })
    }
}
*/

const registerFail = (error) => ({
    type: types.REGISTER_FAIL,
    payload: error
});

const loginStart = () => ({
    type: types.LOGIN_START
});

export const loginSuccess = (user) => ({
    type: types.LOGIN_SUCCESS,
    payload: user
});

const loginFail = (error) => ({
    type: types.LOGIN_FAIL,
    payload: error
});

const logoutStart = () => ({
    type: types.LOGOUT_START
})

const logoutSuccess = () => ({
    type: types.LOGOUT_SUCCESS
})

const logoutFail = (error) => ({
    type: types.LOGOUT_FAIL,
    payload: error
})

export const registerInitiate = (username, email, password) => {
    return function (dispatch) {
        dispatch(registerStart());
        const auth = getAuth(app);
        const db = getFirestore(app);
        createUserWithEmailAndPassword(auth, email, password)
        .then(({user}) => {
            dispatch(registerSuccess(user))
              setDoc(doc(db, "users", user.uid), {
                name: username,
                email: email,
                profileUrl:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              });
        })
        .catch((err) => {
            dispatch(registerFail(err.message));
        })
    }
}

export const loginInitiate = (email, password) => {
    return function (dispatch) {
        dispatch(loginStart());
        const auth = getAuth(app);
        signInWithEmailAndPassword(auth, email, password)
        .then(({user}) => {
            dispatch(loginSuccess(user));
        })
        .catch((err) => {
            dispatch(loginFail(err.message));
        })
    }
}

export const logoutInitiate = () => {
    return function (dispatch) {
        dispatch(logoutStart());
        const auth = getAuth(app);
        signOut(auth)
        .then((resp) => dispatch(logoutSuccess()))
        .catch((error) => dispatch(logoutFail(error.message)))
    }
}