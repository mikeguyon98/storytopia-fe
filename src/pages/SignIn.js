// pages/SignIn.js
import React, { useState } from 'react';
import { signIn } from '../auth';
import { useNavigate, Link } from 'react-router-dom';
import { Email } from '../components/signin/Email';
import { Heading } from '../components/signin/Heading'
import Page from '../components/utils/Page';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/home'); // Redirect to home page on successful sign-in
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/user-not-found':
        return 'No user found with this email. Please check your email or sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      default:
        return 'An error occurred. Please try again later.';
    }
  };

  return (
    <Page>
      <div className="w-full">
        <div className="max-w-lg mx-auto">
          <Heading />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <Email
            password={password}
            setPassword={setPassword}
            email={email}
            setEmail={setEmail}
            onSubmit={handleSignIn}
          />
          <div className="text-center mt-4">
            <Link to="/forget-password" className="text-blue-500 hover:text-blue-700">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default SignIn;