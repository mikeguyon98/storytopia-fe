import React from 'react';

const Hero = () => {
  return (
    <section style={{
      background: 'linear-gradient(to right, #8B5CF6, #6366F1)',
      borderRadius: '8px',
      padding: '32px',
      marginTop: '80px', // Add top margin to account for NavBar
      marginBottom: '48px',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Welcome to Storytopia</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Where your imagination comes to life!</p>
    </section>
  );
};

export default Hero;