import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const BASE_URL = "https://storytopia-fastapi-kgdwevjo6a-ue.a.run.app";

export default function Book() {
  const { currentUser } = useAuth();
  const { bookID } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
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
      className="flex flex-col items-center justify-center mt-16"
      style={{ width: "100%", height: "100vh" }}
    >
      <button
        onClick={toggleAnimations}
        className={`absolute bottom-16 left-4 mt-4 ml-4 p-2 rounded text-white ${
          animationsEnabled ? "bg-purple-600" : "bg-gray-400"
        }`}
      >
        {animationsEnabled
          ? "Disable Text Animations"
          : "Enable Text Animations"}
      </button>
      <div
        className="text-4xl font-bold text-center mb-1"
        style={{
          fontFamily: "Comic Sans MS, cursive, sans-serif",
          maxWidth: "70%",
        }}
      >
        {story.title}
      </div>
      <div className="relative mt-8 mb-6 mx-auto" style={{ height: "65vh" }}>
        <img
          src={story.story_images[currentPage]}
          alt={`Page ${currentPage + 1}`}
          className="w-full h-full"
          style={{ objectFit: "contain" }}
        />
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          className="bg-purple-600 text-white rounded-lg p-4 absolute left-0 top-1/2 transform -translate-y-1/2"
          style={{ marginLeft: "-100px" }}
        >
          <ChevronLeftIcon className="h-12 w-8" aria-hidden="true" />
        </button>
        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, story.story_pages.length - 1))
          }
          className="bg-purple-600 text-white rounded-lg p-4 absolute right-0 top-1/2 transform -translate-y-1/2"
          style={{ marginRight: "-100px" }}
        >
          <ChevronRightIcon className="h-12 w-8" aria-hidden="true" />
        </button>
      </div>
      <div
        className="text-container mt-3 mb-2 px-4"
        style={{
          width: "50%",
          minHeight: "15vh",
          maxHeight: "50vh",
          overflowY: "auto",
          fontSize: "1.35rem",
          fontFamily: "Comic Sans MS, cursive, sans-serif",
        }}
      >
        <p className="text-center">
          {textDisplay ? renderText(textDisplay) : ""}
        </p>
      </div>
      <div className="flex justify-center items-center w-full py-1">
        {Array(story.story_pages.length)
          .fill(null)
          .map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`mx-1 p-2 rounded ${
                index === currentPage
                  ? "bg-purple-600 text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
      </div>
    </div>
  );
}
