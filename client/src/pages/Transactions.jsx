import { useAuth } from './AuthContext';
import React, { useState, useEffect } from 'react';
import {  Card, CardContent, List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';

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
    
    // if (loading) {
    //     return <div>Loading...</div>;
    // }
    // // return (
    // //     <div>
    // //         <h2>Transaction List</h2>
    // //         <ul>
    // //             {transactions?.map((transaction) => (
    // //                 <li key={transaction.id}> id: {transaction.id} acc id: {transaction.account_id} category: {transaction.category} comment: {transaction.comment} time_of_transaction: {transaction.time_of_transaction} whose transaction is it: {transaction.user} </li> 
    // //             ))}
    // //         </ul>
    // //     </div>
    // // );

    // return (
    //     <section className="transactions">
    //         <header>
    //             <h2>Transaction List</h2>
    //         </header>
    //         <ul>
    //             {transactions.map((transaction) => (
    //                 <li key={transaction.id} className="transaction-item">
    //                     <span className="transaction-detail">ID: {transaction.id}</span>
    //                     <span className="transaction-detail">Account ID: {transaction.account_id}</span>
    //                     {/* Other transaction details */}
    //                 </li> 
    //             ))}
    //         </ul>
    //     </section>
    // );
    // if (loading) {
    //     return (
    //         <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    //             <CircularProgress />
    //         </Box>
    //     );
    // }

    // return (
    //     <Box sx={{ bgcolor: '#f5f5f5', p: 2, margin: '16px', borderRadius: '4px' }}>
    //         <Typography variant="h6" gutterBottom>
    //             Transaction List
    //         </Typography>

    //         <List dense>
    //             {transactions.map((transaction) => (
    //                 <ListItem key={transaction.id} divider>
    //                     <ListItemText
    //                         primary={[`Transaction ID: ${transaction.id}`, `, Amount: ${transaction.amount}`]}
    //                         secondary={[`Account ID: ${transaction.account_id}`, `, Category: ${transaction.category}, Time: ${transaction.time_of_transaction}`]}

    //                     />
    //                 </ListItem>
    //             ))}
    //         </List>
    //     </Box>
    // );
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box 
            display="flex" 
            flexWrap="wrap" 
            justifyContent="center" 
            alignItems="flex-start" 
            gap={2} // Dies erzeugt einen Abstand zwischen den Boxen
            p={2}
        >
            {transactions.map((transaction) => (
                <Card key={transaction.id} sx={{
                     minWidth: 275, 
                     maxWidth: 'calc(50% - 16px)',
                     backgroundColor: transaction.amount < 0 ? 'magenta' : 'gray', // Conditional color based on amount
                     }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Transaction ID: {transaction.id}
                        </Typography>
                        <Typography variant="h5" component="div">
                            ${transaction.amount} {/* Angenommen, Sie haben einen Betrag */}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Account ID: {transaction.account_id}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Time: {transaction.time_of_transaction}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
    
};

export default Transactions;