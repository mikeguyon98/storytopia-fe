import React, { useState } from 'react';
import { signIn } from '../auth';
import { useNavigate } from 'react-router-dom';
import { SplashButton } from '../components/buttons/SplashButton';
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
      setError(error.message);
    }
  };

  return (
    <Page>
      {/* <h1>Sign In</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSignIn}>Sign In</button> */}
      {error && <p>{error}</p>}
      <Heading />
      <Email 
        password={password} 
        setPassword={setPassword} 
        email={email}
        setEmail={setEmail}
        onSubmit={handleSignIn}
      />
    </Page>
  );
};

const Email = ({password, setPassword, email, setEmail, onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="email-input" className="mb-1.5 block text-zinc-400">
          Email
        </label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@provider.com"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <div className="mb-6">
        <div className="mb-1.5 flex items-end justify-between">
          <label htmlFor="password-input" className="block text-zinc-400">
            Password
          </label>
        </div>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
        />
      </div>
      <SplashButton type="submit" className="w-full">
        Sign in
      </SplashButton>
    </form>
  );
};

const Heading = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-9 mt-6 space-y-1.5">
        <h1 className="text-2xl font-semibold">Sign in to your account</h1>
        <p className="text-zinc-400">
          Don't have an account?{" "}
          <a href="#" className="text-blue-400" onClick={() => navigate("/signup")}>Create One.</a>
        </p>
      </div>
    </div>
  );
};


export default SignIn;
