import React, { useState, useEffect } from 'react';
import './comment.css';
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import PostAuthor from './PostAuthor';
import Likes from './Likes';
import app from '../../../Firebase';
import { getFirestore, collection, addDoc, query, onSnapshot } from 'firebase/firestore';

const Comment = () => {
    const [comment, setComment] = useState("");
    const [allComments, setAllComments] = useState([]);
    const location = useLocation();
    const data = location.state?.data;
    const user = useSelector(state => state.user.currentUser);
    const db = getFirestore(app);

    const getComments = async () => {
        setAllComments([]);
        const q = query(collection(db, "posts", data.id, "userPosts", data.postId, "comments"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setAllComments(prevComment => [...prevComment, doc.data()]);
            });
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length === 0) return;

        await addDoc(collection(db, "posts", data.id, "userPosts", data.postId, "comments"), {
            name: user.name,
            profileUrl: user.profileUrl,
            comment: comment,
            userId: user.uid
        });
        setComment("");
    }

    useEffect(() => {
        getComments();
    }, []);

    return (
        <div className="container">
            <div style={{ marginTop: "9vh" }} className="content">
                <div className="posts">
                    <PostAuthor userId={data.id} time={data.time} />

                    <div className="post-body">
                        {data.caption.length > 0 ? (

                            <div className="user-caption">
                                <p>{data.caption}</p>
                            </div>
                        ) : null}
                        {data.imageUrl ? (
                            <img src={data.imageUrl} className="user-pic" alt="user" />
                        ) : null}

                        <div className="post-footer">
                            <Likes user={user} postDetail={data} />
                        </div>
                    </div>
                </div>
                <div className="upload">
                    <div className="functions">
                        <img src={user.profileUrl} className="photo" alt="" />
                        <input type="text"
                            className="caption"
                            placeholder="Write a comment"
                            name="comment"
                            onChange={(event) => setComment(event.target.value)}
                            value={comment}
                        />
                        <button id="post" type="submit" onClick={handleSubmit}>Post</button>
                    </div>
                </div>

                {allComments.map((item) => (
                    <div className="comments">
                        <div className="comment-user">
                            <img src={item.profileUrl} className="comment-user-photo" alt="" />
                            <p className="comment-username">{item.name}</p>
                        </div>
                        <p className="comment">{item.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comment
