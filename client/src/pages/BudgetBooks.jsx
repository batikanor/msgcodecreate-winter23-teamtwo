import { useAuth } from './AuthContext';
import React, { useState, useEffect } from 'react';
import Transactions from './Transactions';
import Plot from 'react-plotly.js';

// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
import { List, ListItem, ListItemText, Paper, Typography, Box, Button, TextField, CircularProgress, MenuItem } from '@mui/material';
// import Divider from '@mui/material/Divider';
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
    const [plotData, setPlotData] = useState([]);
    const [plotsData, setPlotsData] = useState({});

    const handleSelectChange = (e) => {
        setSelectedBudgetBook(e.target.value);
    };

    const getPlotForBudgetBook = async (bbId) => {
        const jwt_token = localStorage.getItem('userToken');

        const resp2 = await fetch('http://127.0.0.1:5000/plot', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ budgetbook_id: bbId })
        });
        const respj = await resp2.json();
        console.log(respj)
        return JSON.parse(respj.graphJSON); 
    };
    const getPlotForBudgetBook2 = async (bbId) => {
        const jwt_token = localStorage.getItem('userToken');

        const resp2 = await fetch('http://127.0.0.1:5000/plot2', {
            method: 'POST',

            headers: {
                'Authorization': `Bearer ${jwt_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ budgetbook_id: bbId })
        });
        const respj = await response.json();
        console.log(respj)
        return bbId
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

                // 

                const plotsPromises = data.map(book => getPlotForBudgetBook(book.id));
                const plotsResults = await Promise.all(plotsPromises);

                // const plotsPromises = budgetBooks.map(book => getPlotForBudgetBook(book.id));
                // const plotsResults = await Promise.all(plotsPromises);

                // Process and store plot data
                const newPlotsData = {};
                plotsResults.forEach((plot, index) => {
                    const bookId =data[index].id;
                    newPlotsData[bookId] = plot;
                });
                setPlotsData(newPlotsData);
                console.log('newplotsdata', newPlotsData)
                setLoading(false); // Set loading to false


            } catch (error) {
                console.error('Error fetching data from backend:', error);
                setLoading(false); // Set loading to false on error

            }


        };

        fetchBudgetBooks(); 
    
    }, []);
    


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
    // if (loading) {
    //     return <div>Loading...</div>;
    // }
    // return (
    //     <div>

    //         <Divider></Divider>
    //         <Divider></Divider>
    //         <Divider></Divider>
    //         <Divider></Divider>
    //         <Divider></Divider>

    //         <h2>Budget Book List</h2>
    //         <Divider></Divider>
    //         <Divider></Divider>
    //         <Divider></Divider>
    //         <Divider></Divider>
    //         <Divider></Divider>
    //         <ul>
    //             {budgetBooks?.map((budgetBook) => (
    //                 <List sx={style} component="nav" aria-label="mailbox folders">
    //                     <React.Fragment key={budgetBook.id}>
    //                         <li>ID: {budgetBook.id}, name: {budgetBook.name} User's id : {budgetBook.user}</li>
    //                         {/* <ul><Transactions bbId={budgetBook.id} /></ul> */}
    //                         <Divider></Divider>
    //                         <Divider></Divider>

    //                         <ListItem divider>
    //                             <ListItemText primary="Transactions" />
    //                             <Transactions bbId={budgetBook.id} />
    //                         </ListItem>
    //                     </React.Fragment>
    //                 </List>




    //             ))}
    //         </ul>
    //         <select value={selectedBudgetBook} onChange={handleSelectChange}>
    //             <option value="">Select a Budget Book</option>
    //             {budgetBooks.map((book) => (
    //                 <option key={book.id} value={book.id}>{book.id}: {book.name}</option>
    //             ))}
    //         </select>
    //         <button onClick={handleButtonClick}>Print Selected Budget Book</button>
    //     </div>
    // );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={3} sx={{ margin: '16px', padding: '16px' }}>
            <Typography variant="h4" gutterBottom>
                Budget Book List
            </Typography>

            <List>
                {budgetBooks.map( (budgetBook) => (
                    <React.Fragment key={budgetBook.id}>
                        <ListItem>
                            <ListItemText
                                primary={`ID: ${budgetBook.id}, name: ${budgetBook.name}`}
                                secondary={`User's id : ${budgetBook.user}`}
                            />
                            <Transactions bbId={budgetBook.id} />
                        </ListItem>
                        {plotsData[budgetBook.id] && (
                            <Plot 
                            data={plotsData[budgetBook.id].data}
                            layout={plotsData[budgetBook.id].layout} 
                            />
                        )}
                    </React.Fragment>
                ))}
            </List>

            <TextField
                select
                label="Select a Budget Book"
                value={selectedBudgetBook}
                onChange={(e) => setSelectedBudgetBook(e.target.value)}
                helperText="Please select your budget book"
                variant="outlined"
                fullWidth
                margin="normal"
            >
                {budgetBooks.map((book) => (
                    <MenuItem key={book.id} value={book.id}>
                        {book.id}: {book.name}
                    </MenuItem>
                ))}
            </TextField>
            
            <Button variant="contained" color="primary" onClick={handleButtonClick}>
                Print Selected Budget Book
            </Button>
        </Paper>
    );

};

export default BudgetBooks;