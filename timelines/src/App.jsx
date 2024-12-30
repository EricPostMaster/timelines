import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateEntry from './pages/CreateEntry';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-entry" element={<CreateEntry />} />
      </Routes>
    </Router>
  );
};

export default App;
