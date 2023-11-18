import { useState, useEffect } from 'react'
import reactLogo from './assets/msg.svg'
import viteLogo from './assets/msg.svg'
import axios from 'axios';
import Registration from './Registration';
import Login from './Login';
import UsersList from './UsersList';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [backendResponse, setBackendResponse] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // hook for side effect in component to make a sample request.
  useEffect(() => {
    // Check if user is logged in when the app loads
    const token = localStorage.getItem('userToken');
    if (token) {
        setIsAuthenticated(true);
    }
    // sample Axios GET request to the Flask server
    console.log('Making request to Flask backend');
    axios.get('http://127.0.0.1:5000/')
      .then(response => {
        setBackendResponse(response.data.status);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []); // empty array here means this effect runs 1 time after the initial render
  
  const handleLoginSuccess = (token) => {
    localStorage.setItem('userToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
  };


  return (
    <>
        {!isAuthenticated ? (
            <div>
                <Registration />
                <Login onLoginSuccess={handleLoginSuccess} />
            </div>
        ) : (
            <div>
                <p>You are logged in.</p>
                <button onClick={handleLogout}>Logout</button>
                <UsersList />
            </div>
        )}

        <div>  
          <div>
            {/* <Registration /> */}
            {/* <Login /> */}
            {/* <UsersList /> */}
          </div>
            <div>
              <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>

            <p>Sample Backend Response: {backendResponse}</p>
        </div>  
    </>
  )
}

export default App
