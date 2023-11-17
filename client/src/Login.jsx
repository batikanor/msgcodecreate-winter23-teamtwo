import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    // declare state variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    // login form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // 
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', { username, password });
            setMessage(response.data.message);
            // TODO: put login logic here, such as redirecting the user or storing the logged-in state
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Failed to get response from the server');
        }
    };
    // return jsx for this componetn
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
