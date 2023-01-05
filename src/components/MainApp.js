import React,{ useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import app from '../Firebase';
import { onAuthStateChanged } from '@firebase/auth';
import { registerSuccess } from '../redux/action';
import Register from './auth/Register';
import Login from './auth/Login';
import Feeds from './home/feeds/Feeds';
import Profile from './home/profile/Profile';
import AddPost from './home/addPosts/AddPost';
import Follow from './home/follow/Follow';
import {getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Navbar from './home/navbar/Navbar';
import Search from './home/navbar/Search';
import ChatList from './home/chats/ChatList';
import Chat from './home/chats/Chat';
import Comment from './home/feeds/Comment';

const MainApp = () => {

    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const auth = getAuth(app);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(user){
                dispatch(registerSuccess(user));
                const db = getFirestore(app);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    user = {name: docSnap.data().name, profileUrl: docSnap.data().profileUrl,...user};
                    dispatch(registerSuccess(user));
                }
            }
            setLoading(false);
        })
    },[])

    if(loading){
        return <h1>Loading</h1>
    }

    if(user){
        return(
            <>
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/feeds" element={<Feeds/>} />
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/add" element={<AddPost/>}/>
                    <Route path="/follow" element={<Follow/>}/>
                    <Route path="/search" element={<Search/>}/>
                    <Route path="/chats" element={<ChatList/>}/>
                    <Route path="/chat" element={<Chat/>}/>
                    <Route path="/comment" element={<Comment/>}/>
                    <Route path="*" element={<Feeds/>} />
                </Routes>
            </BrowserRouter>
            </>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="*" element={<Login/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default MainApp
