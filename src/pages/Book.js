import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaLock, FaLockOpen, FaPlay, FaVolumeMute, FaVolumeUp, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "http://localhost:8000";

export default function Book() {
  const { currentUser } = useAuth();
  const { bookID } = useParams();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const audioRef = useRef(new Audio());

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

  const fetchAudio = useCallback(async () => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const token = await currentUser.getIdToken();
    const response = await axios.get(`${BASE_URL}/stories/story/${bookID}/tts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setAudioFiles(response.data.audio_files);
    return response.data.audio_files;
  }, [currentUser, bookID]);

  const {
    data: story,
    isLoading: storyLoading,
    error,
  } = useQuery({
    queryKey: ["stories", bookID],
    queryFn: fetchStory,
    enabled: !!currentUser,
  });

  useEffect(() => {
    fetchAudio();
  }, [fetchAudio]);

  useEffect(() => {
    if (audioFiles[currentPage]) {
      audioRef.current.src = audioFiles[currentPage];
      if (isTheaterMode && !isMuted) {
        audioRef.current.play();
      }
    }
  }, [currentPage, audioFiles, isTheaterMode, isMuted]);

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

  const handleTogglePrivacy = () => {
    togglePrivacy();
  };

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
    if (!isTheaterMode) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('theater-mode');
      if (!isMuted) {
        audioRef.current.play();
      }
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('theater-mode');
      audioRef.current.pause();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      if (isTheaterMode) {
        audioRef.current.play();
      }
    } else {
      audioRef.current.pause();
    }
  };

  const handleAudioEnd = useCallback(() => {
    if (isTheaterMode && story && currentPage < story.story_pages.length - 1) {
      setTimeout(() => {
        setCurrentPage(prevPage => prevPage + 1);
      }, 2000); // 2-second pause between pages
    } else if (story && currentPage === story.story_pages.length - 1) {
      setIsTheaterMode(false);
    }
  }, [isTheaterMode, story, currentPage]);

  useEffect(() => {
    const currentAudio = audioRef.current;
    currentAudio.addEventListener('ended', handleAudioEnd);
    return () => {
      currentAudio.removeEventListener('ended', handleAudioEnd);
    };
  }, [handleAudioEnd]);

  const handlePageClick = (event) => {
    if (!story) return;
    const { clientX, target } = event;
    const { left, width } = target.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width / 2) {
      setCurrentPage((p) => Math.max(p - 1, 0));
    } else {
      setCurrentPage((p) => Math.min(p + 1, story.story_pages.length - 1));
    }
  };

  if (storyLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
  }

  if (!story) {
    return <div className="flex justify-center items-center h-screen">No story data available</div>;
  }

  const isCurrentUserAuthor = currentUser && story.author_id === currentUser.uid;

  return (
    <div className={`flex flex-col items-center min-h-screen bg-black ${isTheaterMode ? 'pt-0' : 'pt-20'} pb-10 px-4`}>
      <AnimatePresence>
        {isTheaterMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          >
            <button
              onClick={toggleTheaterMode}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              <FaTimes />
            </button>
            <div className="relative w-full h-[70vh]" onClick={handlePageClick}>
              <img
                src={story.story_images[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-container mt-3 mb-2 px-4 text-white w-full max-w-4xl">
              <p className="text-center" style={{
                fontSize: "1.35rem",
                fontFamily: "Comic Sans MS, cursive, sans-serif",
              }}>
                {story.story_pages[currentPage]}
              </p>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
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
          </motion.div>
        )}
      </AnimatePresence>

      {!isTheaterMode && (
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-center mb-2 text-white">{story.title}</h1>
          <p className="text-center mb-8 text-gray-300">
            By{" "}
            <Link to={`/profile/${story.author}`} className="text-blue-400 hover:text-blue-300">
              {story.author || "Unknown Author"}
            </Link>
          </p>
          <div className="mb-8 overflow-hidden flex justify-center relative">
            <div className="relative w-full h-[65vh]" onClick={handlePageClick}>
              <img
                src={story.story_images[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
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
              {story.story_pages[currentPage]}
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
              onClick={toggleTheaterMode}
              className={`p-2 rounded text-white flex items-center ${
                isTheaterMode ? "bg-purple-600" : "bg-gray-400"
              }`}
            >
              <FaPlay className="mr-2" />
              Start Theater Mode
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
      )}
    </div>
  );
}