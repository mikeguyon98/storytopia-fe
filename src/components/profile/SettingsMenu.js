import React, { useState } from 'react';

export const SettingsMenu = ({ onLogout }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
      <button 
        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};