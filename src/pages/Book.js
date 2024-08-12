import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaLock, FaLockOpen, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const BASE_URL = "http://localhost:8000";

export default function Book() {
  const { currentUser } = useAuth();
  const { bookID } = useParams();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);

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
    isLoading: storyLoading,
    error,
  } = useQuery({
    queryKey: ["stories", bookID],
    queryFn: fetchStory,
    enabled: !!currentUser,
  });

  const { mutate: togglePrivacy } = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("User not authenticated");
      const token = await currentUser.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/stories/story/${bookID}/toggle-privacy`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["stories", bookID]);
    },
  });

  const speakText = useCallback((text) => {
    if (synth.speaking) {
      synth.cancel();
    }
    if (!isMuted) {
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.onend = () => {
        if (isTheaterMode && story && currentPage < story.story_pages.length - 1) {
          setTimeout(() => {
            setCurrentPage(prevPage => prevPage + 1);
          }, 2000); // 2-second pause between pages
        } else if (story && currentPage === story.story_pages.length - 1) {
          setIsTheaterMode(false);
        }
      };
      synth.speak(utteranceRef.current);
    }
  }, [isTheaterMode, story, currentPage, isMuted, synth]);

  const stopSpeaking = useCallback(() => {
    if (synth.speaking) {
      synth.cancel();
    }
  }, [synth]);

  useEffect(() => {
    if (story) {
      if (isTheaterMode) {
        speakText(story.story_pages[currentPage]);
      } else {
        stopSpeaking();
      }
    }
  }, [isTheaterMode, currentPage, story, speakText, stopSpeaking]);

  const handleTogglePrivacy = () => {
    togglePrivacy();
  };

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
  };

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
    if (!isTheaterMode) {
      setCurrentPage(0);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopSpeaking();
    } else if (isTheaterMode && story) {
      speakText(story.story_pages[currentPage]);
    }
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

  if (storyLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
  }

  const isCurrentUserAuthor = currentUser && story.author_id === currentUser.uid;

  return (
    <div className="flex flex-col items-center min-h-screen bg-black pt-20 pb-10 px-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">{story.title}</h1>
        <p className="text-center mb-8 text-gray-300">
          By{" "}
          <Link to={`/profile/${story.author}`} className="text-blue-400 hover:text-blue-300">
            {story.author || "Unknown Author"}
          </Link>
        </p>
        <div className="mb-8 overflow-hidden flex justify-center relative">
          <img
            src={story.story_images[currentPage]}
            alt={`Page ${currentPage + 1}`}
            className="w-full h-full"
            style={{ objectFit: "contain", maxHeight: "65vh" }}
          />
          {!isTheaterMode && (
            <>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                className="bg-purple-600 text-white rounded-lg p-4 absolute left-0 top-1/2 transform -translate-y-1/2"
                style={{ marginLeft: "-50px" }}
              >
                <ChevronLeftIcon className="h-12 w-8" aria-hidden="true" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, story.story_pages.length - 1))}
                className="bg-purple-600 text-white rounded-lg p-4 absolute right-0 top-1/2 transform -translate-y-1/2"
                style={{ marginRight: "-50px" }}
              >
                <ChevronRightIcon className="h-12 w-8" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
        <div
          className="text-container mt-3 mb-2 px-4 text-white"
          style={{
            width: "100%",
            minHeight: "15vh",
            maxHeight: "50vh",
            overflowY: "auto",
            fontSize: "1.35rem",
            fontFamily: "Comic Sans MS, cursive, sans-serif",
          }}
        >
          <p className="text-center">
            {story.story_pages[currentPage] ? renderText(story.story_pages[currentPage]) : ""}
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
                    : "bg-gray-300 text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
        </div>
        {isCurrentUserAuthor && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleTogglePrivacy}
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4"
            >
              {story.private ? <FaLock className="mr-2" /> : <FaLockOpen className="mr-2" />}
              {story.private ? "Private" : "Public"}
            </button>
          </div>
        )}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={toggleAnimations}
            className={`p-2 rounded text-white ${
              animationsEnabled ? "bg-purple-600" : "bg-gray-400"
            }`}
          >
            {animationsEnabled ? "Disable Text Animations" : "Enable Text Animations"}
          </button>
          <button
            onClick={toggleTheaterMode}
            className={`p-2 rounded text-white flex items-center ${
              isTheaterMode ? "bg-purple-600" : "bg-gray-400"
            }`}
          >
            {isTheaterMode ? (
              <>
                <FaPause className="mr-2" />
                Stop Theater Mode
              </>
            ) : (
              <>
                <FaPlay className="mr-2" />
                Start Theater Mode
              </>
            )}
          </button>
          <button
            onClick={toggleMute}
            className={`p-2 rounded text-white flex items-center ${
              isMuted ? "bg-red-600" : "bg-gray-400"
            }`}
          >
            {isMuted ? <FaVolumeMute className="mr-2" /> : <FaVolumeUp className="mr-2" />}
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>
    </div>
  );
}