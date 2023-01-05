import React, { useState } from 'react';
import app from '../../../Firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import PostAuthor from './PostAuthor';
import Likes from './Likes';

const ShareThoughts = ({ user }) => {
    const [caption, setCaption] = useState("");
    const [captionData, setCaptionData] = useState("");
    const [captionId, setCaptionId] = useState(null);
    const [captionPosted, setCaptionPosted] = useState(false);
    const db = getFirestore(app);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (caption.length === 0) return;

        setCaptionData(caption);
        setCaption("");

        await addDoc(collection(db, "posts", user.uid, "userPosts"), {
            caption: caption,
            time: new Date().getTime()
        })
        .then((resp) => {
            setCaptionId(resp.id)
            setCaptionPosted(true);
        })
    }

    return (
        <div className="upload">
            <div className="functions">
                <img src={user.profileUrl} className="photo" alt="" />
                <input type="text"
                    className="caption"
                    placeholder="Share your thoughts with us!"
                    name="caption"
                    onChange={(event) => setCaption(event.target.value)}
                    value={caption}
                />
                <button id="post" type="submit" onClick={handleSubmit}>Post</button>
            </div>

            {captionPosted === true && captionId ? (
                <div className="posts">
                    <PostAuthor userId={user.uid} />
                    <div className="post-caption-body">
                        <div className="user-caption">
                            <p>{captionData}</p>
                        </div>

                        <div className="post-btns">
                            <Likes user={user} postDetail={captionId} />
                            <button id="comment">Comment</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default ShareThoughts
