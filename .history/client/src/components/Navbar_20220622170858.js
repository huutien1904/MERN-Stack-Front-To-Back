import React, { Fragment } from 'react';
import { Link, Navigate } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <a href='index.html'><i className="fas fa-code"></i></a>
      </h1>
      <ul>
        <li><a href=''>Developers</a></li>
        <li><a href=''>Register</a></li>
        <li><a href=''>Login</a></li>
      </ul>
    </nav>
  )
}

export default Navbar