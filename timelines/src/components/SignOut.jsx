import React from 'react';
import { auth } from '../firebase-config'; // Assuming your Firebase config is correct

const SignOut = () => {
  const handleSignOut = () => {
    auth.signOut().then(() => {
      console.log('Signed out successfully');
    });
  };

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOut;
