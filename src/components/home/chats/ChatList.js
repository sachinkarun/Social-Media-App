import React,{ useState, useEffect } from 'react';
import app from '../../../Firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ChatList = () => {
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
            <h1>Chat with Others</h1>

            {users.map((item) => (
                <>
                {item.id !== user.uid ? (
                    <div className="f-users" key={item.id}>
                        <div className="f-part1">
                            <img src={item.profileUrl} className="photo" alt=""/>
                            <h2 className="f-username">{item.name}</h2>
                        </div>
                        <Link to="/chat" state={{ data1: user.uid, data2:item }}>
                            <button className="f-btn">Messages</button>
                        </Link>
                    </div>
                ) : null}
                </>
            ))}
        </div>
    )
}

export default ChatList
