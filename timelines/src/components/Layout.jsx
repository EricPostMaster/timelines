import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/create-entry" style={styles.link}>Create Entry</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#4CAF50',
    padding: '10px 20px',
    color: 'white',
    textAlign: 'center',
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    margin: '0 15px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  },
};

export default Layout;
