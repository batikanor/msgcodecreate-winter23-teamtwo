import { useAuth } from './AuthContext';
import React, { useState, useEffect } from 'react';
import {  Card, CardContent, List, ListItem, ListItemText, Typography, Box, CircularProgress, TextField, Button } from '@mui/material';

const Transactions = ({ bbId }) => {
    const [refresh, setRefresh] = useState(true)
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [newTransactionAmount, setNewTransactionAmount] = useState(''); 
    const [newTransactionCategory, setNewTransactionCategory] = useState(''); 


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
    }, [bbId,  refresh]); // Add bbId as a dependency to useEffect

    const handleTransactionAmountInputChange = (e) => {
        setNewTransactionAmount(e.target.value);
    };
    const handleTransactionCategoryInputChange = (e) => {
        setNewTransactionCategory(e.target.value);
    };
    const handleButtonClick = async () => {
        // const selectedBook = budgetBooks.find(book => book.id === selectedBudgetBook);
        // console.log('Selected Budget Book id:', selectedBudgetBook || 'None selected');
        const jwt_token = localStorage.getItem('userToken');

        const response = await fetch('http://127.0.0.1:5000/addtransactions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${jwt_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ budgetbook_id: bbId, category: newTransactionCategory, comment: "com", account_id: "1", amount: newTransactionAmount })
        });
        console.log(await response.ok)
        if (response.ok){
            console.log("ok")
        } else {
            console.log("not ok")
        }

        setRefresh(!refresh)

    };




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
        <><Box
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
                    backgroundColor: transaction.amount < 0 ? '#9c2d60' : 'gray', // Conditional color based on amount
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
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Category: {transaction.category}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
        <Box 
            component="div"
            display="flex" 
            flexDirection="column"  // Set the direction to column
            justifyContent="center" 
            alignItems="center"
            gap={2} // Add a gap between items for better spacing
        >
            <TextField
                label="Enter the transaction amount"
                variant="outlined"
                value={newTransactionAmount}
                onChange={handleTransactionAmountInputChange}
            />
            <TextField
                label="Enter the transaction category"
                variant="outlined"
                value={newTransactionCategory}
                onChange={handleTransactionCategoryInputChange}
            />
            <Button variant="contained" color="primary" onClick={handleButtonClick}>
                Add new transaction
            </Button>
        </Box>
        
        </>
    );
    
};

export default Transactions;