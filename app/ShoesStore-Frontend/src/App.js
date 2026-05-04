import "./App.css";
import LayoutUserSide from "./Layout/LayoutUserSide";
import HomeAdmin from "./adminSide/HomeAdmin";
import LoginAdmin from "./adminSide/pages/LoginAdmin";
import { Progress } from "reactstrap";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
    const loading = useSelector((state) => state.user.status);
    const isAdminPath = window.location.pathname.startsWith("/admin");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const adminUser = JSON.parse(localStorage.getItem("admin_user"));

    return (
        <>
            {loading === "loading" ? (
                <Progress animated value="100" className="progress"></Progress>
            ) : (
                ""
            )}

            {isAdminPath ? (
                // Khu vực xác thực Admin
                adminUser !== null && (adminUser.role === "Admin" || adminUser.role === "Manager") ? (
                    <HomeAdmin />
                ) : (
                    <Routes>
                        <Route path="/admin/login" element={<LoginAdmin />} />
                        <Route path="*" element={<Navigate to="/admin/login" replace />} />
                    </Routes>
                )
            ) : (
                // Khu vực xác thực User
                currentUser !== null ? (
                    currentUser.role === "Guest" ? (
                        <LayoutUserSide />
                    ) : (
                        // Tài khoản admin cũng có thể vô user view hoặc bạn có thể redirect tùy nghiệp vụ
                        <LayoutUserSide />
                    )
                ) : (
                    <LayoutUserSide />
                )
            )}
        </>
    );
}

export default App;
