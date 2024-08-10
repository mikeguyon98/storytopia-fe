import React, { useState } from "react";
import { Grid } from '../icons/Grid'
import { Bookmark } from "../icons/Bookmark";
import { Heart } from "../icons/Heart";
import { Private } from "../icons/Private"

export const Tabs = ({tabData, selected, setSelected}) => {
  return (
    <div>
      <div className="grid max-w-4xl grid-cols-2 gap-4 py-12 lg:grid-cols-4">
        {tabData.map((t) => (
          <ToggleButton
            key={t.id}
            id={t.id}
            selected={selected}
            setSelected={setSelected}
          > 
                {t.title}
          </ToggleButton>
        ))}
      </div>
    </div>
  );
};

const ToggleButton = ({ children, selected, setSelected, id }) => {

  const getIcon = (text) => {
    switch (text) {
        case 'Posts':
        return <Grid />;
        case 'Private':
        return <Private />;
        case 'Saved':
        return <Bookmark />;
        default:
        return <Heart />; // Default icon
    }
  };

  return (
    <div
      className={`rounded-lg transition-colors ${
        selected === id ? "bg-indigo-600" : "bg-zinc-900"
      }`}
    >
      <button
        onClick={() => setSelected(id)}
        className={`w-full origin-top-left rounded-lg border py-3 text-xs font-medium transition-all md:text-base ${
          selected === id
            ? "-translate-y-1 border-indigo-600 bg-white text-indigo-600"
            : "border-zinc-900 bg-white text-zinc-900 hover:-rotate-2"
        }`}
      > 
        <div className="mx-auto flex items-center gap-2 w-fit">
            {getIcon(children)}
            {children}
        </div>
      </button>
    </div>
  );
};