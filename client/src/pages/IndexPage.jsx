import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import axios from "axios";

function IndexPage() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    const createMockData = async () => {
        const jwt_token = localStorage.getItem('userToken');
        console.log('jwt_token: ', jwt_token)
        const response = await fetch('http://127.0.0.1:5000/mock', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwt_token}` 
            },
          });
        console.log('response:', response)
    }


    useEffect( () => {
        createMockData()
      }, []);

    
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            this is an index page
        </div>
    );
}

export default IndexPage;