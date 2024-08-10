import React from "react";
import { SplashButton } from "../buttons/SplashButton";
import { GhostButton } from "../buttons/GhostButton";
import { useNavigate } from 'react-router-dom';

export const NavCTAs = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2">
      <GhostButton
        onClick={() => navigate("/signup")}
        className="rounded-md px-4 py-1 text-base"
      >
        Sign up
      </GhostButton>
      <SplashButton
        onClick={() => navigate("/signin")}
        className="px-4 py-1 text-base text-zinc-100"
      >
        Sign in
      </SplashButton>
    </div>
  );
};
