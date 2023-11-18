import { useAuth } from './AuthContext';
import React, { useState, useEffect } from 'react';

const Transactions = ({ bbId }) => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const jwt_token = localStorage.getItem('userToken');
                const url = `http://127.0.0.1:5000/transactions?budgetbook_id=${bbId}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${jwt_token}` 
                    },
                  });
                console.log(response)
                const data = await response.json();

                console.log('Transactions:', data);

                setTransactions(data);
                setLoading(false); // Set loading to false

            } catch (error) {
                console.error('Error fetching data from backend:', error);
                setLoading(false); // Set loading to false on error

            }
        };

        fetchTransactions(); 
    }, [bbId]); // Add bbId as a dependency to useEffect
    
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Transaction List</h2>
            <ul>
                {transactions?.map((transaction) => (
                    <li key={transaction.id}> blabla</li> 
                ))}
            </ul>
        </div>
    );
};

export default Transactions;