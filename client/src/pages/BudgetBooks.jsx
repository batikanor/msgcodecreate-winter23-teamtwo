import { useAuth } from './AuthContext';
import React, { useState, useEffect } from 'react';
import Transactions from './Transactions';

const BudgetBooks = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [budgetBooks, setBudgetBooks] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchBudgetBooks = async () => {
            try {
                const jwt_token = localStorage.getItem('userToken');
                const response = await fetch('http://127.0.0.1:5000/budgetbooks', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${jwt_token}` 
                    },
                  });
                const data = await response.json(); // Parse JSON response

                console.log('Budget Books:', data);
                // console.log('Budget Books response:', response);
                // console.log('Budget Books response.json:', response.json());
                // console.log('Budget Books response.text:', response.text());

                setBudgetBooks(data);
                setLoading(false); // Set loading to false

            } catch (error) {
                console.error('Error fetching data from backend:', error);
                setLoading(false); // Set loading to false on error

            }
        };

        fetchBudgetBooks(); 
    }, []);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Budget Book List</h2>
            <ul>
                {budgetBooks?.map((budgetBook) => (
                    <>
                        <li key={budgetBook.id}> ID: {budgetBook.id}, name: {budgetBook.name} User's id : {budgetBook.user}</li>
                        <li><Transactions bbId={budgetBook.id} /></li>
                    </>
                ))}
            </ul>
        </div>
    );
};

export default BudgetBooks;