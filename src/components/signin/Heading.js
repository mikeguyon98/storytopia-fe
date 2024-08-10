import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Heading = () => {
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