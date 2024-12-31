import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailAuthProvider } from 'firebase/auth'; // Import EmailAuthProvider
import FirebaseAuth from '../components/FirebaseAuth';
import { auth } from '../firebase-config';

const Signup = () => {
  const navigate = useNavigate();

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID, // Correctly reference the email provider
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        navigate('/home'); // Redirect to home on success
        return false; // Prevent default redirect behavior
      },
    },
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Sign Up</h1>
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
};

export default Signup;
