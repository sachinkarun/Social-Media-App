import React,{useState, useEffect} from 'react';
import app from '../../../Firebase';
import {getFirestore, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';


const FollowBtn = (props) => {
    const [followUser, setFollowUser] = useState(false);
    const db = getFirestore(app);

    useEffect(() => {
        const getInfo = async() => {
            const docRef = doc(db, "followers", props.data2, "userFollowers", props.data1);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setFollowUser(true);
            }
        }

        getInfo();
    },[]);

    const followFunc = async() => {
        if(followUser === true){
            await deleteDoc(doc(db, "following", props.data1, "userFollowing", props.data2), {});
            await deleteDoc(doc(db, "followers", props.data2, "userFollowers", props.data1), {});
        }
        else{
            await setDoc(doc(db, "following", props.data1, "userFollowing", props.data2), {});
            await setDoc(doc(db, "followers", props.data2, "userFollowers", props.data1), {});
        }   
        setFollowUser(!followUser);
    }

    return (
        <>
        {followUser ? (
            <button onClick={followFunc} className="f-btn">following</button>
            ) : (
            <button onClick={followFunc} className="f-btn">follow</button>
        )}
        </>
    )
}

export default FollowBtn
