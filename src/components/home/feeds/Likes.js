import React,{ useState, useEffect } from 'react';
import app from '../../../Firebase';
import {getFirestore, collection, setDoc, doc, getDoc, deleteDoc, query, getDocs } from 'firebase/firestore';

const Likes = ({user, postDetail}) => {
    const [like, setLike] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);
    const db = getFirestore(app);

    const handleLike = async() => {
        if(like === false){
            setLike(true);
            setTotalLikes(totalLikes + 1);
            await setDoc(doc(db, "posts", postDetail.id, "userPosts", postDetail.postId, "likes", user.uid), {
                name: user.name,
                profileUrl: user.profileUrl
            });
        }
        else{
            setLike(false);
            setTotalLikes(totalLikes - 1);
            await deleteDoc(doc(db, "posts", postDetail.id, "userPosts", postDetail.postId, "likes", user.uid));
        }
    }

    const check = async() => {
        const docRef = doc(db, "posts", postDetail.id, "userPosts", postDetail.postId, "likes", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setLike(true);
        }
    }

    const getTotalLikes = async() => {
        const q = query(collection(db, "posts", postDetail.id, "userPosts", postDetail.postId, "likes"));

        const querySnapshot = await getDocs(q);
        let len = querySnapshot.size;
        setTotalLikes(len);
    }

    useEffect(() => {
        check();
        getTotalLikes();
    }, []);

    return (
        <>
            <h5>{totalLikes} likes</h5>
            {like ? (
                <button id="like" onClick={handleLike}>Unlike</button>
            ) : (
                <button id="like" onClick={handleLike}>Like</button>
            )}
        </>
    )
}

export default Likes
