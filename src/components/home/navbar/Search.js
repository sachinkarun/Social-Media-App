import React,{ useState } from 'react';
import './search.css';
import app from '../../../Firebase';
import { collection, query, where, getFirestore, getDocs } from "firebase/firestore";

const Search = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const db = getFirestore(app);

    const searchUser = async() => {
        setUsers([]);
        const q = query(collection(db, "users"), where("name", "==", `${search}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setUsers(currArr => [...currArr, doc.data()]);
        });
    }
    
    return (
        <div className="f-container">
            <input
                name="search"
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />
            <button className="nav-btn" onClick={searchUser}>Find</button>
            {users.map((item) => (
                    <div className="f-users">
                        <div className="f-part1">
                            <img src={item.profileUrl} className="photo" alt=""/>
                            <h2 className="f-username">{item.name}</h2>
                        </div>
                            <button className="f-btn">Messages</button>
                    </div>
                ))}
        </div>
    )
}

export default Search
