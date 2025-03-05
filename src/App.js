import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AuthPage from "./Pages/AuthReg/Auth";
import AdminPage from "./AdminPage/admin";
import AdminProducts from "./AdminPage/AdminProducts";
import NewProduct from "./AdminPage/NewProducr";
import ProtectedRoute from "./config/ProtectedRoute";
import { AuthProvider, useAuth } from "./config/AuthContext";
import AdminHeader from "./Components/HeaderAdmin";
import NewPromotion from "./AdminPage/NewPromotion";
import PromotionPage from "./Pages/PromotionPage";
import UserHomePage from "./Pages/UserHomePage";


import { useLocation } from "react-router-dom";
function AppContent() {
    const { user } = useAuth();
    const location = useLocation(); // 👈 Получаем текущий путь

    // ❌ Скрываем админ-хэдер на странице авторизации
    const hideAdminHeader = location.pathname === "/регистрация";
    return (
        <>
            {!hideAdminHeader && user?.role === "admin" && <AdminHeader />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/регистрация" element={<AuthPage />} />
                <Route path="/акции" element={<PromotionPage/>} />
                <Route path="/домашняя-страница" element={<UserHomePage/>}/>
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/newpromotion"
                    element={
                        <ProtectedRoute>
                            <NewPromotion/>
                        </ProtectedRoute>
                        }
                />
                <Route
                    path="/adminproducts"
                    element={
                        <ProtectedRoute>
                            <AdminProducts />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/newproducts"
                    element={
                        <ProtectedRoute>
                            <NewProduct />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}
function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
