import React from 'react';
import '../styles/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-title">Task Management System</div>
      <ul className="navbar-nav">
        <li className="nav-item">User Management</li>
        <li className="nav-item">Profile</li>
        <li className="nav-item">Logout</li>
      </ul>
    </nav>
  );
}

export default Navbar;