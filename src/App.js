import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Main from './pages/Main';
import NavBar from './components/NavBar';
import { AuthProvider, useAuth } from './AuthProvider';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser && <NavBar />}
      <Routes>
        <Route path="/" element={!currentUser ? <Main /> : <Navigate to="/home" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
