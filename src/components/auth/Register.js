import React,{ useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerInitiate } from '../../redux/action';

const Register = () => {
    const [data, setData] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:""
    });

    const { username, email, password, confirmPassword } = data;
    const dispatch = useDispatch();

    const handleChange = (e) => {
        let {name, value} = e.target;
        setData({...data, [name]: value})
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            return;
        }

        dispatch(registerInitiate(username, email, password));
        setData({username:"", email:"", password:"", confirmPassword:""});
    }

    return (
        <div className="l-container">
            <div className="l-form">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                    <br/>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                    <br/>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                    <br/>
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                    <br/>
                    <div className="l-form-btn">
                        <button className="l-btn" type="submit">Signup</button>
                    </div>
                </form>

                <p className="l-tag">Already have an Account?</p>
                <Link to="/login">
                    <button className="l-btn">Login</button>
                </Link>
            </div>
        </div>
    )
}

export default Register
