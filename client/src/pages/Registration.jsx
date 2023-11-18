import React, { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

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
        <div className="mt-4">
      <h1 className="text-4xl text-center">Register</h1>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />{" "}
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <Link to='/start'><button type="submit" className="mt-2 px-4 py-2 bg-gray-300">Register</button></Link>
       
      </form>
      {message && <p>{message}</p>}
    </div>
    );
};

export default Registration;
