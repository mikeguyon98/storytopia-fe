import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const NavBar = () => {
  const { currentUser, signOut } = useAuth();

  return (
    <nav className="flex bg-black gap-4 sticky text-white">
      <Link to="/signup">Sign Up</Link>
      <Link to="/signin">Sign In</Link>
      {currentUser && (
        <>
          <Link to="/home">Home</Link>
          <button onClick={signOut} className="">
            Sign Out
          </button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
