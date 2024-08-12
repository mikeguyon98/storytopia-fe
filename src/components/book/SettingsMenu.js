import React, { useState } from 'react';

export const SettingsMenu = ({ onClick, animationsEnabled }) => {
  return (
    <div className="absolute left-0 mt-2 w-[210px] bg-white shadow-lg rounded-lg z-50">
      <button 
        className={`block w-full text-left px-4 py-2 text-gray-800 ${
            animationsEnabled ? "bg-white" : "bg-gray-400"
          } hover:bg-gray-200 rounded-lg`}
        onClick={onClick}
      >
        {animationsEnabled
          ? "Disable Text Animations"
          : "Enable Text Animations"}
      </button>
    </div>
  );
};