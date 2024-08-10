import React, { useState } from 'react';

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    // Logic to generate story and comic book would go here
    console.log('Generating story for:', prompt);
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="e.g., Mexican Culture" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #E5E7EB' }}
        />
        <button 
          onClick={handleGenerate} 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#FCD34D', 
            color: '#4C1D95', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Generate Story
        </button>
      </div>
    </div>
  );
};

export default StoryGenerator;