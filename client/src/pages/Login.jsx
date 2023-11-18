import React, { useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom"

const Login = ({ onLoginSuccess }) => {
    // declare state variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    // login form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents default form submission action from happening
        console.log('handling login form submission')
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', { username, password });
            // TODO: Mayhaps make some of the loggings optoinal depending on verbosity of program or debug/production mode etc... 
            console.log('response ', response);
            console.log(response.data.access_token)
            if (response.data.access_token) {
                onLoginSuccess(response.data.access_token);
            } else {
                setMessage('Login successful, but no token received');
            }
        } catch (error) {
            console.log("Login unsuccesful")
            console.log(error)
            setMessage(error.response ? error.response.data.message : 'Login Failed: Failed to get response from the server!');
        }
    };
  // return jsx for this component
  return (
    <div className="mt-4">
      <h1 className="text-4xl text-center">Login</h1>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />{" "}
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        <button type="submit" className="mt-2 px-4 py-2 bg-gray-300">Login</button>
        <span className="px-4 text-underline">Do you have an account yet? <Link to={'/register'}><u>Register</u></Link></span>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
  // return (
  //     <div>
  //         <h2>Login</h2>
  //         <form onSubmit={handleSubmit}>
  //             <div>
  //                 <label htmlFor="username">Username:</label>
  //                 <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
  //             </div>
  //             <div>
  //                 <label htmlFor="password">Password:</label>
  //                 <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
  //             </div>
  //             <button type="submit">Login</button>
  //         </form>
  //         {message && <p>{message}</p>}
  //     </div>
  // );
};

export default Login;
