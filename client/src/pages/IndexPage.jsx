import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState} from 'react';
import axios from "axios";
import BudgetBooks from './BudgetBooks';

function IndexPage() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [isDataLoaded, setIsDataLoaded] = useState(false); 
    const navigate = useNavigate();
    const [budgetBookName, setBudgetBookName] = useState(''); 

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
    const handleCreateBudgetBook = () => {
      console.log('Creating budget book with name:', budgetBookName);
      //TODO: add logic
    };
  
    const handleBudgetBookNameChange = (e) => {
      setBudgetBookName(e.target.value);
    };
  
    return (
        <div>
            <button onClick={handleLogout}>Logout</button>

            
            <p>Thank you for logging in.</p>
            <p>Please find your current budget books below.</p>
            {isDataLoaded && <BudgetBooks />}
            <p>Click the button below if you want to add a new budget book.</p>
            <input
              type="text"
              placeholder="Enter Budget Book Name"
              value={budgetBookName}
              onChange={handleBudgetBookNameChange}
            />
            <button onClick={handleCreateBudgetBook}>Create Budget Book</button>


        </div>
    );
}

export default IndexPage;