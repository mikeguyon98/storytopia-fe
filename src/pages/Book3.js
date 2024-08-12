import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaLock, FaLockOpen, FaPlay, FaVolumeMute, FaVolumeUp, FaTimes } from "react-icons/fa";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { SplashButton } from "../components/buttons/SplashButton";
import { GhostButton } from "../components/buttons/GhostButton";

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

  if (storyLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
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
            <img
              src={story.story_images[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="max-w-full max-h-[70vh] object-contain mb-8"
            />
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
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                className="bg-purple-600 text-white rounded-lg p-2"
              >
                <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
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
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, story.story_pages.length - 1))}
                className="bg-purple-600 text-white rounded-lg p-2"
              >
                <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
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
            <Link 
                to={story.author_id === currentUser.uid ? "/profile" : `/profile/${story.author}`} 
                className="text-blue-400 hover:text-blue-300"
                >
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
          </div>
          <SplashButton
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              className="p-4 absolute left-20 top-1/2 transform -translate-y-1/2"
              style={{ marginLeft: "-50px" }}
            >
              <ChevronLeftIcon className="h-12 w-8" aria-hidden="true" />
            </SplashButton>
            <SplashButton
              onClick={() => setCurrentPage((p) => Math.min(p + 1, story.story_pages.length - 1))}
              className="p-4 absolute right-20 top-1/2 transform -translate-y-1/2"
              style={{ marginRight: "-50px" }}
            >
              <ChevronRightIcon className="h-12 w-8" aria-hidden="true" />
          </SplashButton>
          <div
            className="text-container mt-3 mb-2 px-4 text-white"
            style={{
              width: "100%",
              minHeight: "15vh",
              maxHeight: "50vh",
              overflowY: "auto",
              fontSize: "1.35rem",
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
                  className={`h-3 w-3 mx-3 rounded-full transition-colors ${
                    index === currentPage ? "bg-neutral-50" : "bg-neutral-500"
                  }`}
                >
                </button>
              ))}
          </div>
          {isCurrentUserAuthor && (
            <div className="flex justify-center mt-4">
              <GhostButton
                onClick={handleTogglePrivacy}
                className="flex items-center"
              >
                {story.private ? <FaLock className="mr-2" /> : <FaLockOpen className="mr-2" />}
                {story.private ? "Private" : "Public"}
              </GhostButton>
            </div>
          )}
          <div className="flex justify-center mt-4 space-x-4">
            <GhostButton
              onClick={toggleTheaterMode}
              className={`p-2 rounded text-white flex items-center ${
                isTheaterMode ? "bg-zinc-800 text-zinc-50" : ""
              }`}
            >
              <FaPlay className="mr-2" />
              Start Theater Mode
            </GhostButton>
            <GhostButton
              onClick={toggleMute}
              className={`p-2 rounded text-white flex items-center ${
                isMuted ? "bg-red-600" : ""
              }`}
            >
              {isMuted ? <FaVolumeMute className="mr-2" /> : <FaVolumeUp className="mr-2" />}
              {isMuted ? "Unmute" : "Mute"}
            </GhostButton>
          </div>
        </div>
      )}
    </div>
  );
}