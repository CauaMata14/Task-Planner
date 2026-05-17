import React from 'react';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Task Planner</div>
        <div className="user-info">
          <span className="user-email">{user.email}</span>
          <button className="btn btn-secondary" onClick={onLogout}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
