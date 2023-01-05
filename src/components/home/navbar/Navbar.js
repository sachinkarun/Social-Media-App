import React,{ useState } from 'react';
import './navbar.css';
import { Link } from "react-router-dom";
import app from '../../../Firebase';
import Logo from './logo.png';
import { getFirestore } from "firebase/firestore";
import { GrHomeRounded, GrMenu, GrClose } from 'react-icons/gr';
import { FiPlusSquare } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { BiSearch } from 'react-icons/bi';

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(false);
    const db = getFirestore(app);

    return (
            <header className={isMobile ? "navbar-mobile" : "navbar"}>
                <div className="nav-left">
                <img src={Logo} className="logo" alt=""/>
                    <h3>Instagram</h3>
                </div>

                <ul className={isMobile ? "nav-links-mobile" : "nav-links"}>
                    <li className="nav-item">
                        <Link to="/feeds">
                            <GrHomeRounded size="20px"/><span className={isMobile ? "icon-name1": "icon-name2"}>Home</span>
                        </Link>
                        </li>
                    <li className="nav-item">
                        <Link to="/add">
                            <FiPlusSquare size="23px" color="black"/><span className={isMobile ? "icon-name1": "icon-name2"}>Add new post</span>
                        </Link>
                        </li>
                    <li className="nav-item">
                        <Link to="/profile">
                            <CgProfile size="22px" color="black"/><span className={isMobile ? "icon-name1": "icon-name2"}>Profile</span>
                        </Link>
                        </li>
                    <li className="nav-item">
                        <Link to="/search">
                            <BiSearch size="24px" color="black"/><span className={isMobile ? "icon-name1": "icon-name2"}>Search</span>
                        </Link>
                        </li>
                </ul>

                <div className="nav-right">
                <img src={Logo} className="logo" alt=""/>
                    <h3>Instagram</h3>
                </div>
                {isMobile ? (
                    <div className="hamburgur" onClick={() => setIsMobile(!isMobile)}>
                        <GrClose size="25px"/>
                    </div>
                ) : (
                    <div className="hamburgur" onClick={() => setIsMobile(!isMobile)}>
                        <GrMenu size="25px"/>
                    </div>
                    )}
            </header>
    )
}

export default Navbar
