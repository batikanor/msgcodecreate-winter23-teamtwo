import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState} from 'react';
import axios from "axios";
import BudgetBooks from './BudgetBooks';

function IndexPage() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [isDataLoaded, setIsDataLoaded] = useState(false); 
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
        setIsDataLoaded(true); // Update the state when data is loaded
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
            {isDataLoaded && <BudgetBooks />}
        </div>
    );
}

export default IndexPage;