import React,{ useState, useEffect } from 'react';
import './follow.css';
import app from '../../../Firebase';
import {getFirestore, collection, getDocs } from 'firebase/firestore';
import FollowBtn from './FollowBtn';
import { useSelector } from 'react-redux';

const Follow = () => {
    const [users, setUsers] = useState([]);
    const user = useSelector(state => state.user.currentUser);

    const getData = async() => {
        setUsers([]);
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            let val = {id:doc.id, ...doc.data()};
            setUsers(arr => [...arr, val]);
        });
    }
    
    useEffect(() => {
        getData();
    }, [])

    return (
        <div className="f-container">
            <h1>Follow Other Users</h1>

            {users.map((item) => (
                <>
                {item.id !== user.uid ? (
                    <div className="f-users" key={item.id}>
                        <div className="f-part1">
                            <img src={item.profileUrl} className="photo" alt=""/>
                            <h2 className="f-username">{item.name}</h2>
                        </div>
                        <FollowBtn data1={user.uid} data2={item.id}/>
                    </div>
                ) : null}
                </>
            ))}
        </div>
    )
}

export default Follow
