import React,{ useState } from 'react';
import './authStyle.css';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { loginInitiate } from '../../redux/action';

const Login = () => {
    const [data, setData] = useState({
        email:"",
        password:""
    });
    const {email, password} = data;
    const dispatch = useDispatch();

    const handleChange = (e) => {
        let {name, value} = e.target;
        setData({...data, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!email || !password){
            return;
        }

        dispatch(loginInitiate(email, password))
    }

    return (
        <div className="l-container">

            <div className="l-form">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                    <br/>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />

                    <div className="l-form-btn">
                        <button className="l-btn" type="submit">Login</button>
                    </div>
                </form>

                <p className="l-tag">Don't have an Account?</p>
                <Link to="/Register">
                    <button className="l-btn">Signup</button>
                </Link>
            </div>
        </div>
    )
}

export default Login
