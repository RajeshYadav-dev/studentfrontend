import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentList from "./components/StudentList";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddStudent from "./components/AddStudent";
import EditStudent from "./components/EditStudent";
import StudentCard from "./components/StudentCard";
import ErrorPage from "./components/ErrorPage";
import HomeLogin from "./components/HomeLogin";
import AuthGuard from "./components/AuthGuard";
import { logoutStudent } from "./services/StudentServices";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    logoutStudent();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={<HomeLogin setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/add-student" element={<AddStudent />} />
        <Route
          path="/student-list"
          element={
            <AuthGuard>
              <StudentList />
            </AuthGuard>
          }
        />
        <Route
          path="/edit-student/:std_id"
          element={
            <AuthGuard>
              <EditStudent />
            </AuthGuard>
          }
        />
        <Route
          path="/profile/:std_id"
          element={
            <AuthGuard>
              <StudentCard />
            </AuthGuard>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
