import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '../auth';
import { useNavigate, Link } from 'react-router-dom';
import Page from '../components/utils/Page';
import { SplashButton } from '../components/buttons/SplashButton';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationFn: ({ email, password }) => signIn(email, password),
    onSuccess: () => {
      navigate('/explore');
    },
    onError: (error) => {
      setError(getErrorMessage(error.code));
    }
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null); // Clear any existing errors
    signInMutation.mutate({ email, password });
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSignIn}>
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
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <SplashButton 
                type="submit" 
                className="w-full" 
                disabled={signInMutation.isLoading}
              >
                {signInMutation.isLoading ? 'Signing In...' : 'Sign In'}
              </SplashButton>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forget-password" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </Link>
          </div>

          <p className="mt-10 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Page>
  );
};

export default SignIn;