import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { SplashButton } from "../components/buttons/SplashButton";
import { Settings } from "../components/profile/Settings";
import { SettingsMenu } from "../components/book/SettingsMenu";

const BASE_URL = "https://storytopia-fastapi-kgdwevjo6a-ue.a.run.app";

export default function Book() {
  const { currentUser } = useAuth();
  const { bookID } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [textDisplay, setTextDisplay] = useState("");

  const fetchStory = async () => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const token = await currentUser.getIdToken();
    const response = await axios.get(`${BASE_URL}/stories/story/${bookID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const {
    data: story,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stories", bookID],
    queryFn: () => fetchStory(),
    enabled: !!currentUser,
  });

  useEffect(() => {
    // Clear the text display initially when page or animation setting changes
    setTextDisplay("");

    if (story) {
      // Schedule text update to trigger with or without animation based on setting
      const timer = setTimeout(() => {
        setTextDisplay(story.story_pages[currentPage]);
      }, 50); // Short delay to avoid any flash before animation
      return () => clearTimeout(timer);
    }
  }, [currentPage, animationsEnabled, story]);

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
  };

  const handleSettingsClick = () => {
    setMenuOpen(!menuOpen);
  };

  const renderText = (text) => {
    if (!animationsEnabled || !text) return text;

    return text.split("").map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.02, duration: 0.1 }}
      >
        {char}
      </motion.span>
    ));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div
      className="flex flex-col items-center justify-center mt-16 w-full h-fit"
    >
      <div className="flex flex-row gap-7">
        <div
          className="text-xl font-bold text-center my-6"
        >
          {story.title}
        </div>
        <div className="relative mt-6">
          <Settings onClick={handleSettingsClick} />
          {menuOpen && <SettingsMenu onClick={toggleAnimations} animationsEnabled={animationsEnabled} />}
        </div>
      </div> 
        <img
          src={story.story_images[currentPage]}
          alt={`Page ${currentPage + 1}`}
          className="max-w-3xl rounded-lg mx-auto"
        />
        <p className="text-center text-lg p-12 mx-8">
          {textDisplay ? renderText(textDisplay) : ""}
        </p>
        <SplashButton
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          className="rounded-lg p-4 absolute left-0 top-1/2 transform -translate-y-1/2 ml-4"
        >
          <ChevronLeftIcon className="h-12 w-8" aria-hidden="true" />
        </SplashButton>
        <SplashButton
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, story.story_pages.length - 1))
          }
          className="rounded-lg p-4 absolute right-0 top-1/2 transform -translate-y-1/2 mr-4"
        >
          <ChevronRightIcon className="h-12 w-8" aria-hidden="true" />
        </SplashButton>
      <div className="mt-4 flex w-full justify-center gap-2">
        {Array(story.story_pages.length)
          .fill(null)
          .map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-3 w-3 rounded-full transition-colors text-sm ${
                index === currentPage ? "bg-neutral-50" : "bg-neutral-500"
              }`}
            >
            </button>
          ))}
      </div>
    </div>
  );
}
