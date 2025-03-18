import React, { useState, useEffect } from "react";
import { loginStudent } from "../services/StudentServices";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentStudents } from "../services/StudentServices";

const HomeLogin = ({ setIsAuthenticated }) => {
  const [loginDetail, setLoginDetail] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // Store user object

  const navigate = useNavigate();

  // ✅ Fetch current user once after component mounts
  useEffect(() => {
    getCurrentStudents()
      .then((response) => {
        setCurrentUser(response.data); // Ensure this is an object
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      });
  }, []); // Runs only once on mount

  // ✅ Redirect if user is logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken && currentUser) {
      if (currentUser.role === "admin") {
        navigate("/student-list");
      } else {
        navigate(`/profile/${currentUser.std_id}`);
      }
    }
  }, [navigate, currentUser]); // Runs when `currentUser` changes

  const handleOnChange = (event) => {
    setLoginDetail({ ...loginDetail, [event.target.name]: event.target.value });
  };

  const handleOnFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginStudent(loginDetail);
      const { access_token, student } = response;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("std_id", student.std_id);
      setIsAuthenticated(true);
      toast.success("Login successful!");

      if (student.role === "admin") {
        navigate("/student-list");
      } else {
        navigate(`/profile/${student.std_id}`);
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Invalid email or password");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card shadow-sm back">
            <div className="card-body">
              <h1 className="text-center">
                Welcome To Student Management System
              </h1>

              <div className="card mt-3">
                <div className="card-body back">
                  <h2 className="text-center">Login</h2>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleOnFormSubmit}>
                    <div className="form-group">
                      <label className="mb-2">Email</label>
                      <input
                        type="email"
                        className="form-control form-control-lg mb-2"
                        placeholder="Enter email"
                        name="email"
                        value={loginDetail.email}
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="mb-2">Password</label>
                      <input
                        type="password"
                        className="form-control form-control-lg mb-2"
                        placeholder="Password"
                        name="password"
                        value={loginDetail.password}
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-primary mt-2 w-100"
                        disabled={loading}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <p className="text-center mt-4">
                <Link
                  to="/add-student"
                  className="d-block text-decoration-none text-white"
                >
                  Don't have an account? <strong>Sign up here</strong>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLogin;
