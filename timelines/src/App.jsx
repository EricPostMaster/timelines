import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import CreateEntry from './pages/CreateEntry';
import Home from './pages/Home';
import Navbar from './components/Navbar';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        {user && <Navbar />}
      </div>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route path="/create-entry" element={user ? <CreateEntry /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
