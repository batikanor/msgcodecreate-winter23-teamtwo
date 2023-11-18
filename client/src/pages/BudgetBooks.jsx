import { useAuth } from './AuthContext';
import React, { useState, useEffect } from 'react';
import Transactions from './Transactions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  };
  
const BudgetBooks = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [budgetBooks, setBudgetBooks] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [selectedBudgetBook, setSelectedBudgetBook] = useState('');

    const handleSelectChange = (e) => {
        setSelectedBudgetBook(e.target.value);
    };

    const handleButtonClick = () => {
        // const selectedBook = budgetBooks.find(book => book.id === selectedBudgetBook);
        console.log('Selected Budget Book id:', selectedBudgetBook || 'None selected');
    };

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

    // return (
    //     <div>
    //         <h2>Budget Book List</h2>
    //         <ul>
    //             {budgetBooks?.map((budgetBook) => (
    //                 <>
    //                     <li key={budgetBook.id}> ID: {budgetBook.id}, name: {budgetBook.name} User's id : {budgetBook.user}</li>
    //                     <ul><Transactions bbId={budgetBook.id} /></ul>
    //                 </>
    //             ))}
    //         </ul>
    //     </div>
    // );
    return (
        <div>

            <Divider></Divider>
            <Divider></Divider>
            <Divider></Divider>
            <Divider></Divider>
            <Divider></Divider>

            <h2>Budget Book List</h2>
            <Divider></Divider>
            <Divider></Divider>
            <Divider></Divider>
            <Divider></Divider>
            <Divider></Divider>
            <ul>
                {budgetBooks?.map((budgetBook) => (
                    <List sx={style} component="nav" aria-label="mailbox folders">
                        <React.Fragment key={budgetBook.id}>
                            <li>ID: {budgetBook.id}, name: {budgetBook.name} User's id : {budgetBook.user}</li>
                            {/* <ul><Transactions bbId={budgetBook.id} /></ul> */}
                            <Divider></Divider>
                            <Divider></Divider>

                            <ListItem divider>
                                <ListItemText primary="Transactions" />
                                <Transactions bbId={budgetBook.id} />
                            </ListItem>
                        </React.Fragment>
                    </List>




                ))}
            </ul>
            <select value={selectedBudgetBook} onChange={handleSelectChange}>
                <option value="">Select a Budget Book</option>
                {budgetBooks.map((book) => (
                    <option key={book.id} value={book.id}>{book.id}: {book.name}</option>
                ))}
            </select>
            <button onClick={handleButtonClick}>Print Selected Budget Book</button>
        </div>
    );
};

export default BudgetBooks;