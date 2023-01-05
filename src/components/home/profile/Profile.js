import React, { useState, useEffect } from 'react';
import './profile.css';
import { useSelector, useDispatch } from 'react-redux';
import { logoutInitiate } from '../../../redux/action';
import { useNavigate } from 'react-router-dom';
import app from '../../../Firebase';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { IoIosArrowBack } from 'react-icons/io';

const Profile = () => {
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [posts, setPosts] = useState(0);
    const [allPosts, setAllPosts] = useState([]);
    const navigate = useNavigate();

    const db = getFirestore(app);
    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(logoutInitiate());
    }

    const getImage = (e) => {
        e.preventDefault();
        let file = e.target[0].files[0];
        if (file) {
            changeProfile(file);
        }
    }

    const changeProfile = (file) => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        }, (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(async (url) => {
                        const path = doc(db, "users", user.uid);
                        await updateDoc(path, {
                            profileUrl: url
                        });
                    })
            })
    }

    var tempPosts = [];
    const getPosts = async () => {
        const querySnapshot = await getDocs(collection(db, "posts", user.uid, "userPosts"));
        let len = querySnapshot.size;
        setPosts(len);
        len = 0;
        querySnapshot.forEach((doc) => {
            if (doc.data().imageUrl) {
                len++;
                if(!tempPosts.includes(doc.data().time)){
                    setAllPosts(prevPosts => [...prevPosts, doc.data().imageUrl]);
                    tempPosts.push(doc.data().time);
                }
            }
        });
        setPosts(len);
    }

    const getFollowDetails = async () => {
        const querySnapshot = await getDocs(collection(db, "following", user.uid, "userFollowing"));
        let len = querySnapshot.size;
        setFollowing(len);

        const querySnapshot2 = await getDocs(collection(db, "followers", user.uid, "userFollowers"));
        let len2 = querySnapshot2.size;
        setFollowers(len2);
    }

    const goBack = () => {
        navigate("/feeds");
    }

    useEffect(() => {
        getFollowDetails();
        getPosts();
    }, []);

    return (
        <div className="profile-body">
            <div className="profile-container">
                <h1 onClick={goBack} style={{ cursor: 'pointer' }}><IoIosArrowBack size="22px"/>Profile</h1>
                <br />

                <div className="profile-head">
                    <img src={user.profileUrl} className="profile-img" alt="" />
                    <div>
                        <div>
                            <h2>{user.name}</h2>
                            <h2>~{user.email}</h2>
                        </div>
                        <div className="profile-info">
                            <div className="profile-data">
                                <h3>Following</h3>
                                <h3>{following}</h3>
                            </div>
                            <div className="profile-data">
                                <h3>Followers</h3>
                                <h3>{followers}</h3>
                            </div>
                            <div className="profile-data">
                                <h3>Posts</h3>
                                <h3>{posts}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-btns">
                    <form onSubmit={getImage}>
                        <input type="file" className="add-file" />
                        <button className="profile-btn" type="submit">Change profile</button>
                    </form>
                    <button className="profile-btn" onClick={logout}>Logout</button>
                </div>

                <div className="profile-gallery">
                    {allPosts.map((item) => (
                        <img src={item} className="gallery-post" alt="" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile
