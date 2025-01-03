import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import CreateEntry from './pages/CreateEntry';
import Home from './pages/Home';
import ViewEntry from './pages/ViewEntry';
import EditEntry from './pages/EditEntry';
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
        <Route path="/view-entry/:id" element={user ? <ViewEntry /> : <Navigate to="/" />} />
        <Route path="/edit-entry/:id" element={user ? <EditEntry /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
