import { useAuth } from './AuthContext';
import React, { useState, useEffect } from 'react';

const Transactions = ({ bbId }) => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // const jwt_token = localStorage.getItem('userToken');
                const jwt_token = localStorage.getItem('userToken');

                // const url = `http://127.0.0.1:5000/transactions?budgetbook_id=${bbId}`;

                // const response = await fetch(url, {
                //     method: 'GET',
                //     headers: {
                //       'Authorization': `Bearer ${jwt_token}` 
                //     },
                //     // body: JSON.stringify({ budgetbook_id: bbId })
                //   });

                const response = await fetch('http://127.0.0.1:5000/transactions', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${jwt_token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ budgetbook_id: bbId })
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
    // return (
    //     <div>
    //         <h2>Transaction List</h2>
    //         <ul>
    //             {transactions?.map((transaction) => (
    //                 <li key={transaction.id}> id: {transaction.id} acc id: {transaction.account_id} category: {transaction.category} comment: {transaction.comment} time_of_transaction: {transaction.time_of_transaction} whose transaction is it: {transaction.user} </li> 
    //             ))}
    //         </ul>
    //     </div>
    // );

    return (
        <section className="transactions">
            <header>
                <h2>Transaction List</h2>
            </header>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id} className="transaction-item">
                        <span className="transaction-detail">ID: {transaction.id}</span>
                        <span className="transaction-detail">Account ID: {transaction.account_id}</span>
                        {/* Other transaction details */}
                    </li> 
                ))}
            </ul>
        </section>
    );


};

export default Transactions;