import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { AuthContext } from '../context/AuthContext';
import '../Navbar.css';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/create-entry">Create Entry</Link></li>
        {user && (
          <li><button onClick={handleSignOut}>Sign Out</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;