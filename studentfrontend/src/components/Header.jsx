import React from "react";
import { Link } from "react-router-dom";

const Header = ({ isAuthenticated, onLogout }) => {
  return (
    <header>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Student Management System
          </Link>
          <div className="ms-auto">
            {" "}
            {/* Pushes content to the right */}
            {isAuthenticated ? (
              <button className="btn btn-danger" onClick={onLogout}>
                Logout
              </button>
            ) : (
              <Link to="/" className="btn btn-primary">
                Login
              </Link>
            )}
            <Link to="/add-admin" className="btn btn-primary">
              Admin
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
