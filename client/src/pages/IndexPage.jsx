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
  <h1 className="text-4xl font-bold text-center">Budget Plan</h1>

        <button className="bg-red-500 p-1 text-white rounded" onClick={handleLogout}>Logout</button>
      <BudgetBookTable />
    </>
  );
}

export default IndexPage;
