import React, { useState } from 'react';
import axios from 'axios';

// TODO: Code is quite readable thus there aren't comments in this file. However, we could check what kind of commenting guidelines exist in react/flask etc and then do a final code cleaning run in our repo.
const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/register', { username, password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Failed to connect to the server');
        }
    };

    return (
        <div>
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Registration;
