import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';
import { useNavigate } from 'react-router-dom';
import CreateEntry from './pages/CreateEntry';
import Home from './pages/Home';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between signup and login
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      if (isSignUp) {
        // Sign up logic
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/home');
      } else {
        // Login logic
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp((prevMode) => !prevMode);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <button onClick={toggleAuthMode}>
        {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

const App = () => {
  return (
    // Wrap the app in Router for routing functionality
    <Router>
      <Routes>
        {/* Route for the AuthPage */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-entry" element={<CreateEntry />} />
        {/* You can add more routes here, like /home or others */}
      </Routes>
    </Router>
  );
};

export default App;
