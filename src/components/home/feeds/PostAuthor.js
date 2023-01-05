import React, { useState, useEffect } from 'react';
import app from '../../../Firebase';
import { getFirestore, getDoc, doc } from 'firebase/firestore';

const PostAuthor = ({ userId, time }) => {
    const [user, setUser] = useState(null);

    const getUser = async (userId) => {
        const db = getFirestore(app);
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUser(docSnap.data());
        }
    }

    const showDate = (time) => {
        const d = new Date(time);
        if(d.toLocaleDateString() === new Date().toLocaleDateString()){
            return d.toLocaleTimeString();
        }
        else{
            return d.toLocaleDateString();
        }
    }

    useEffect(() => {
        getUser(userId);
    })

    return (
        <>
            {user !== null ? (
                <div className="post-head">
                    <img src={user.profileUrl} className="photo" alt="" />
                    <div>
                        <p className="friend-name">{user.name}</p>
                        <p className="friend-post-date">{showDate(time)}</p>
                    </div>
                </div>
            ) : (
                <div className="post-head">
                    <div className="photo user-photo"></div>
                    <div>
                        <p className="friend-name">User</p>
                        <p className="friend-name">00:00 am</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default PostAuthor
