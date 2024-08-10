// src/pages/Main.js
import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/utils/Page';

const Main = () => {
  return (
    <Page>
      <h1>HELLOOOO</h1>
      <Link to="/signin">
        <button>Sign In</button>
      </Link>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
    </Page>
  );
};

export default Main;
