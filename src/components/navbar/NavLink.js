import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const NavLink = ({ children, external, to = "/home" }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!external) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a
      href={external ? to : "#"}
      rel="nofollow"
      target={external ? "_blank" : undefined}
      onClick={handleClick}
      className="group flex items-center gap-0.5 text-m font-semibold text-zinc-200 transition-colors hover:text-zinc-50 sm:text-sm"
    >
      <span>{children}</span>
      {external && (
        <FiArrowUpRight className="block transition-transform group-hover:rotate-45" />
      )}
    </a>
  );
};