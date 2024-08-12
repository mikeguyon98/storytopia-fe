import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";
import { AuthProvider, useAuth } from "./AuthProvider";
import PrivateRoute from "./PrivateRoute";
import { NavBar } from "./components/navbar/NavBar";
import "./styles/globals.css";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import Book from "./pages/Book3";
import UserProfile from "./pages/UserProfile";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  const { currentUser } = useAuth();
  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar currentUser={currentUser} />
      <Routes>
        <Route
          path="/"
          element={!currentUser ? <SignIn /> : <Navigate to="/home" />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Explore />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <PrivateRoute>
              <Explore />
            </PrivateRoute>
          }
        />
         <Route
          path="/profile/:username"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/:bookID"
          element={
            <PrivateRoute>
              <Book />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <Create />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
