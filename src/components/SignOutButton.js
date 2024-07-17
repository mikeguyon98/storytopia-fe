// src/components/SignOutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const SignOutButton = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/'); // Redirect to sign-in page after sign-out
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;