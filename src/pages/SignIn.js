import React, { useState } from 'react';
import { signIn } from '../auth';
import { useNavigate } from 'react-router-dom';
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
      setError(error.message);
    }
  };

  return (
    <Page>
     <div className="w-full">
      <div className="max-w-lg mx-auto">
          {error && <p>{error}</p>}
          <Heading />
          <Email 
            password={password} 
            setPassword={setPassword} 
            email={email}
            setEmail={setEmail}
            onSubmit={handleSignIn}
          />
        </div>
      </div>
    </Page>
  );
};


export default SignIn;
