import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLogout, userRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Portfolio App</h1>
        </div>
        <ul className="navbar-menu">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/portfolio">Portfolio</a></li>
          {userRole === 'ADMIN' && <li className="admin-badge">Admin</li>}
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
