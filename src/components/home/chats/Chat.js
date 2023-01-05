import React,{ useState, useEffect } from 'react';
import './chat.css';
import app from '../../../Firebase';
import { getFirestore, collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { useLocation } from "react-router-dom";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const location = useLocation();
    const data1 = location.state?.data1;
    const data2 = location.state?.data2;

    const db = getFirestore(app);
    const docId = data1 > data2.id ? data1 + "-" + data2.id : data2.id + "-" + data1;

    var tempMessages = [];
    const getMessages = async() => {
        setMessages([]);
        const q = query(collection(db, "chats", docId, "messages"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(!tempMessages.includes(doc.data().createdAt))
                    setMessages(prevMsg => [...prevMsg, doc.data()]);
                    tempMessages.push(doc.data().createdAt);
            });
        });
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.length === 0) return;

        const mymsg = {
            text: message,
            sentBy:data1,
            sentTo:data2.id,
            createdAt: new Date().getTime()
        }

        await addDoc(collection(db, "chats", docId, "messages"), {
            ...mymsg
        })
        setMessage("");
    }

    useEffect(() => {
        getMessages();
    },[]);

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((item) => (
                    <>
                    {item.sentBy === data1 ? (
                        <div className="chat-user">
                            <p className="text-msg">{item.text}</p>
                        </div>
                    ) : (
                        <div className="chat-otherUser">
                            <div className="chat-profile-detail">
                                <img src={data2.profileUrl} className="chat-profile" alt=""/>
                                <p className="other-username">{data2.name}</p>
                            </div>
                            <p className="text-msg2">{item.text}</p>
                    </div>
                    )}
                    </>
                ))}

            </div>
            <div className="chat-input">
                <input type="text"
                    className="msg"
                    placeholder="Write a message"
                    name="message"
                    onChange={(event) => setMessage(event.target.value)}
                    value={message}
                    />
                <button className="msg-btn" type="submit" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default Chat
