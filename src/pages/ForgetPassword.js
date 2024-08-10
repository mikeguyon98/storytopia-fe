import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendPasswordResetEmail } from '../auth';
import { useNavigate, Link } from 'react-router-dom';
import Page from '../components/utils/Page';
import { SplashButton } from '../components/buttons/SplashButton';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const resetPasswordMutation = useMutation({
    mutationFn: (email) => sendPasswordResetEmail(email),
    onSuccess: () => {
      // Optionally, you can redirect the user after a few seconds
      setTimeout(() => navigate('/signin'), 5000);
    },
  });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetPasswordMutation.mutate(email);
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Forgot Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {resetPasswordMutation.isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{getErrorMessage(resetPasswordMutation.error.code)}</span>
            </div>
          )}
          {resetPasswordMutation.isSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">Password reset email sent. Check your inbox.</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <SplashButton 
                type="submit" 
                className="w-full"
                disabled={resetPasswordMutation.isLoading}
              >
                {resetPasswordMutation.isLoading ? 'Sending...' : 'Reset Password'}
              </SplashButton>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            Remember your password?{' '}
            <Link to="/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Page>
  );
};

export default ForgetPassword;