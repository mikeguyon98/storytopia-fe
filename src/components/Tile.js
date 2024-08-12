import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SolidHeart } from "./icons/SolidHeart";
import { SolidBookmark } from "./icons/SolidBookmark";

export const Tile = ({ image, likes, saves, storyId }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [onClick, setOnClick] = useState(false);

  return (
    <Link to={`/${storyId}`}>
      <motion.div
        className="relative overflow-hidden bg-slate-400 rounded-xl flex justify-center items-center"
        onHoverStart={() => setShowOverlay(true)}
        onHoverEnd={() => setShowOverlay(false)}
        onClick={() => setOnClick(!onClick)}
      >
        <AnimatePresence>
          {(showOverlay || onClick) && (
            <>
              <motion.div
                className="absolute top-0 right-0 z-10 p-2"
                initial={{ opacity: 2 }}
                animate={{ opacity: 2 }}
                whileHover={{ scale: 1.1 }}
              >
              </motion.div>

              <motion.div
                className="absolute inset-0 z-5 flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute bg-black pointer-events-none opacity-50 h-full w-full" />
                <motion.h1
                  className="text-white font-bold text-sm z-6 px-3 py-2 rounded-full flex items-center gap-4 z-10"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  exit={{ y: 10 }}
                >
                  <div className="mx-auto flex items-center gap-2 w-fit">
                    <SolidHeart />
                    {likes.length}
                  </div>
                  <div className="mx-auto flex items-center gap-2 w-fit">
                    <SolidBookmark />
                    {saves.length}
                  </div>
                </motion.h1>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <img src={image} alt={image} className="w-full h-full object-cover" />
      </motion.div>
    </Link>
  );
}