import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailAuthProvider } from 'firebase/auth';
import FirebaseAuth from '../components/FirebaseAuth';
import { auth } from '../firebase-config';

const AuthPage = () => {
  const navigate = useNavigate();

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID, // Email/password support
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        navigate('/home'); // Redirect to home after successful login/signup
        return false; // Prevent default redirect
      },
    },
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome</h1>
      <p>Please log in or sign up to continue.</p>
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
};

export default AuthPage;
