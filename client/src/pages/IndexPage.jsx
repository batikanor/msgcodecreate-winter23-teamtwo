import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function IndexPage() {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsAuthenticated(false);
        navigate('/');
    };


    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            this is an index page
        </div>
    );
}

export default IndexPage;