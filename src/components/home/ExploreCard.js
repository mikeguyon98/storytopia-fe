import React from 'react';
import { Heart } from 'lucide-react';

const ExploreCard = ({ title, description, likes }) => {
  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
      <img src={`https://via.placeholder.com/300x200`} alt="Story thumbnail" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '16px' }}>{description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Heart style={{ width: '20px', height: '20px', color: '#EF4444', marginRight: '4px' }} />
            {likes} likes
          </span>
          <button style={{ padding: '4px 8px', border: '1px solid #8B5CF6', borderRadius: '4px', color: '#8B5CF6', background: 'none', cursor: 'pointer' }}>Read More</button>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;