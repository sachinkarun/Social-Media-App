import React, { useState, useEffect } from 'react';
import './feeds.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import app from '../../../Firebase';
import { getFirestore, collection, getDocs, query, orderBy, limit, getDoc, doc } from "firebase/firestore";
import PostAuthor from './PostAuthor';
import Likes from './Likes';
import ShareThoughts from './ShareThoughts';
import { FiPlusSquare } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { IoMdChatbubbles } from 'react-icons/io';
import { RiUserFollowLine } from 'react-icons/ri';
import { MdManageAccounts } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';

const Feeds = () => {

    const user = useSelector(state => state.user.currentUser);
    const [posts, setPosts] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [following, setFollowing] = useState([]);
    const db = getFirestore(app);

    var tempPosts = [];
    const fetchPosts = async () => {
        let temp = [];
        temp.push(user.uid);
        const querySnapshot = await getDocs(collection(db, "following", user.uid, "userFollowing"));
        querySnapshot.forEach((doc) => {
            temp.push(doc.id);
        });

        let arr = [];
        setPosts(arr);
        for (let docId of temp) {
            const querySnapshot2 = await getDocs(collection(db, "posts", docId, "userPosts"));
            querySnapshot2.forEach((doc) => {
                if(!tempPosts.includes(docId)){
                        let docData = { id: docId, ...doc.data(), postId: doc.id }
                        setPosts(oldEle => [...oldEle, docData]);
                        tempPosts.push(docId);
                    }
                });
        }
        setLoadingData(false);
    }

    var tempArray = [];
    const startConversation = async() => {
        // const usersRef = collection(db, "following", user.uid, "userFollowing");
        const usersRef = collection(db, "users");
        const q = query(usersRef, limit(7));
        const querySnapshot = await getDocs(q);

        setFollowing([]);
        let followingArr = [];
        querySnapshot.forEach((doc) => {
            followingArr.push(doc.id);
        });

        let no = 1;
        for(let docId of followingArr){
            const docRef = doc(db, "users", docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                if(!tempArray.includes(docId)){
                    let docData = {no, ...docSnap.data(), id: docId}
                    setFollowing(prev => [...prev, docData]);
                    no++;
                    tempArray.push(docId);
                }
            }
        }
    }

    useEffect(() => {
        fetchPosts();
        startConversation();
    }, []);

    return (
        <>
            <div className="container">
                <section className="left">
                    <div className="part1">
                        <img src={user.profileUrl} className="photo" alt="" />
                        <div className="username">
                            <Link style={{textDecoration: 'none'}} to="/profile">
                                <p className="name">{user.name}</p>
                            </Link>
                            <p className="email">{user.email}</p>
                        </div>
                    </div>
                    <div className="part2">
                        <Link style={{textDecoration: 'none'}} to="/profile">
                            <p className="options"><CgProfile size="20px"/> <span>Profile</span></p>
                        </Link>
                        <Link style={{textDecoration: 'none'}} to="/add">
                            <p className="options"><FiPlusSquare size="20px"/> Add New Post</p>
                        </Link>
                        <p className="options"><MdManageAccounts size="20px"/> Followers</p>
                        <p className="options"> <RiUserFollowLine size="20px"/>Following</p>
                        <Link style={{textDecoration: 'none'}} to="/follow">
                            <p className="options"><FaUserFriends size="20px"/> Follow Others</p>
                        </Link>
                        <Link style={{textDecoration: 'none'}} to="/chats">
                            <p className="setting"><IoMdChatbubbles size="20px"/> Messeges</p>
                        </Link>
                    </div>
                </section>

                <main className="content">

                    <ShareThoughts user={user} />

                    <div className="feeds">
                        {posts.length > 0 ? (
                            <>
                                {posts.map((item) => (
                                    <div className="posts">
                                        <PostAuthor userId={item.id} time={item.time} />

                                        <div className="post-body">
                                            {item.caption.length > 0 ? (

                                                <div className="user-caption">
                                                <p>{item.caption}</p>
                                            </div>
                                            ) : null}
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} className="user-pic" alt="user" />
                                            ) : null}

                                            <div className="post-footer">
                                                <Likes user={user} postDetail={item} />
                                                <Link to="/comment" state={{ data: item }}>
                                                    <button id="comment">Comment</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : <>
                            {loadingData ? (
                                <h1 style={{textAlign:'center', marginTop:"2vh", height:"100vh"}}>Loading...</h1>
                            ) : (
                                <h1 style={{textAlign:'center', marginTop:"2vh", height:"100vh"}}>Hey {user.name}</h1>
                            )}
                        </>
                    }
                    </div>

                </main>

                <section className="right">
                    <div className="friend-list">
                        <h3>Start a conversation</h3>
                        {following.map((item) => (
                            <Link to="/chat" state={{ data1: user.uid, data2:item }} style={{textDecoration:'none',color: "#49607e"}}>
                                <div className={item.no !== following.length ? "friends1" : "friends2"}>
                                    <img src={item.profileUrl} className="profilepic" alt=""/>
                                    <p className="friend-name">{item.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    )
}

export default Feeds
