import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/users');
                console.log('Users:', response.data);
                // set users in state
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers(); 
    }, []);

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    // TODO: Of course don't show user password (even though they are hashed) here... This is just for demo...
                    <li key={user.id}> ID: {user.id}, Username: {user.username} Password (Hashed) (Just for demo): {user.password}</li> // Use 'key' to provide a unique key for each child
                ))}
            </ul>
        </div>
    );
};

export default UsersList;