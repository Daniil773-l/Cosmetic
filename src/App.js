import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AuthPage from "./Pages/AuthReg/Auth"
import AdminPage from "./AdminPage/admin"
import AdminProducts from "./AdminPage/AdminProducts";
import NewProducr from "./AdminPage/NewProducr";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/регистрация" element={<AuthPage />}/>
                <Route path="/admin" element={<AdminPage/>}/>
                <Route path="/adminproducts" element={<AdminProducts />}/>
                <Route path="/newproducts" element={<NewProducr />}/>
            </Routes>
        </Router>
    );
}

export default App;
