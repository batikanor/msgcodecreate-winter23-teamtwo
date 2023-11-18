import "./App.css";
import {Route, Routes} from "react-router-dom"
import IndexPage from "./pages/IndexPage";
import Layout from "./pages/Layout";
import Login from "./pages/Login"
import Registration from "./pages/Registration";

function App() {
  //const [backendResponse, setBackendResponse] = useState('');

  // // hook for side effect in component to make a sample request.
  // useEffect(() => {
  //   // sample Axios GET request to the Flask server
  //   console.log('Making request to Flask backend');
  //   axios.get('http://127.0.0.1:5000/')
  //     .then(response => {
  //       setBackendResponse(response.data.status);
  //     })
  //     .catch(error => {
  //       console.error('There was an error!', error);
  //     });
  // }, []); // empty array here means this effect runs 1 time after the initial render

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Login />}></Route>
        <Route path="/register" element={<Registration />} />
      </Route>
      <Route path="/start" element={<Layout />}>
        <Route index element={<IndexPage />}/>
      </Route>
    </Routes>
  );
  // return (
  //   <>
  //     <div>
  //       <Registration />
  //       <Login />
  //       <UsersList />
  //     </div>
  //   </>
  // )
}

export default App;
