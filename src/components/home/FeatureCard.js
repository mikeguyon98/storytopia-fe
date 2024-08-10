import React from 'react';

const FeatureCard = ({ Icon, title, description }) => {
  return (
    <div style={{ 
      border: '1px solid #E5E7EB', 
      borderRadius: '8px', 
      padding: '24px', 
      textAlign: 'center' 
    }}>
      <Icon style={{ width: '48px', height: '48px', color: '#8B5CF6', marginBottom: '16px' }} />
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;