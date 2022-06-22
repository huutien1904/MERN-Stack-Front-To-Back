import React from 'react'
import { Link, Navigate } from 'react-router-dom';
const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <a  className="btn btn-primary">
              Sign Up
            </a>
            <a className="btn btn-light">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Landing