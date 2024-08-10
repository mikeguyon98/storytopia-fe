// pages/ForgetPassword.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from '../auth';
import { useNavigate } from 'react-router-dom';
import Page from '../components/utils/Page';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      setSuccess(true);
      setError(null);
      // Optionally, you can redirect the user after a few seconds
      setTimeout(() => navigate('/signin'), 5000);
    } catch (error) {
      setError(getErrorMessage(error.code));
      setSuccess(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email. Please check your email or sign up.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please enter a valid email.';
      default:
        return 'An error occurred. Please try again later.';
    }
  };

  return (
    <Page>
      <div className="w-full">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Success: </strong>
              <span className="block sm:inline">Password reset email sent. Check your inbox.</span>
            </div>
          )}
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default ForgetPassword;