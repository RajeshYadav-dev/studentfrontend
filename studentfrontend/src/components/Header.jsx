import React from "react";
import { Link } from "react-router-dom";

const Header = ({ isAuthenticated, onLogout }) => {
  return (
    <header>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand">
            Student Management System
          </Link>
          <div>
            {isAuthenticated ? (
              <button className="btn btn-danger" onClick={onLogout}>
                Logout
              </button>
            ) : (
              <Link to="/" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
