import React, { useState } from 'react';
import './addPost.css';
import app from '../../../Firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";


const AddPost = () => {
    const navigate = useNavigate();
    const [caption, setCaption] = useState("");
    const [progress, setProgress] = useState(0);
    const user = useSelector(state => state.user.currentUser);
    const db = getFirestore(app);

    const handleChange = (e) => {
        e.preventDefault();
        let file = e.target[0].files[0];
        if (file) {
            addImage(file);
        }
    }

    const addImage = (file) => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(prog);
        }, (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(async (url) => {
                        await addDoc(collection(db, "posts", user.uid, "userPosts"), {
                            imageUrl: url,
                            caption: caption,
                            time: new Date().getTime()
                        });
                        setCaption("");
                    })
                    .then(() => {
                        navigate("/feeds");
                    })
            })
    }

    return (
        <div className="add-container">
            <div className="add-post">
                <h1>Add post</h1>

                <form onSubmit={handleChange} className="add-form">
                    <input type="file" className="add-file"/>
                    <br/>
                    <input
                        type="text"
                        className="add-input"
                        name="caption"
                        onChange={(event) => setCaption(event.target.value)}
                        placeholder="Write caption!"
                        value={caption}
                    />
                    <br/>
                    <button type="submit" className="add-btn">Add Image</button>
                </form>
                <div style={{width:"85%"}}>
                    <div style={{ height: "10px", width: `${progress}%`, backgroundColor: "#1877f2", borderRadius:"5px" }}></div>
                </div>
            </div>
        </div>
    )
}

export default AddPost
