import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import BudgetBookTable from "./BudgetBookTable";

function IndexPage() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <>
        <button className="fixed right-0 bg-red-500 text-white px-4 py-2" onClick={handleLogout}>Logout</button>
        <h1 className="text-4xl font-bold text-center">Budget Plan</h1>
        <BudgetBookTable />
    </>
  );
}

export default IndexPage;
