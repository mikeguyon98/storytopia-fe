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

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = "https://storytopia-fastapi-kgdwevjo6a-ue.a.run.app"

export default function Book() {
  const { currentUser } = useAuth();
  const { bookID } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [textDisplay, setTextDisplay] = useState("");
  const [audioFiles, setAudioFiles] = useState([]);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    if (response.data.audio_files.length > 0) {
      setAudioFiles(response.data.audio_files);
    }
    return response.data;
  };

  const fetchAudio = async () => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    console.log("fetching audio");
    const token = await currentUser.getIdToken();
    const response = await axios.get(
      `${BASE_URL}/stories/story/${bookID}/tts`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setAudioFiles(response.data.audio_files);
    return response.data.audio_files;
  };

  const {
    data: story,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stories", bookID],
    queryFn: fetchStory,
    enabled: !!currentUser,
  });

  useEffect(() => {
    if (audioFiles[currentPage]) {
      const newAudio = new Audio(audioFiles[currentPage]);
      newAudio.addEventListener("ended", handleAudioEnd);
      setAudio(newAudio);
      if (isPlaying) {
        newAudio.play();
      }
    }
  }, [currentPage, audioFiles]);

  useEffect(() => {
    if (story) {
      setTextDisplay(story.story_pages[currentPage]);
    }
  }, [currentPage, story]);

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
  };

  const handleSettingsClick = () => {
    setMenuOpen(!menuOpen);
  };

  const playAudio = () => {
    if (!audio) {
      console.log("fetching audio");
      fetchAudio();
    }
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleAudioEnd = () => {
    const nextIndex = currentPage + 1;
    if (nextIndex < story.story_pages.length) {
      setCurrentPage(nextIndex);
    } else {
      setIsPlaying(false);
      audio.removeEventListener("ended", handleAudioEnd);
      audio.pause();
      setAudio(null);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center mt-16 w-full h-fit">
      <div className="flex flex-row gap-7">
        <div className="text-xl font-bold text-center my-6">{story.title}</div>
        <div className="relative mt-6">
          <Settings onClick={handleSettingsClick} />
          {menuOpen && (
            <SettingsMenu
              onClick={toggleAnimations}
              animationsEnabled={animationsEnabled}
            />
          )}
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
        onClick={() => {
          if (audio) {
            audio.pause(); // Pause current audio
            setIsPlaying(false);
          }
          setCurrentPage((p) => Math.max(p - 1, 0));
        }}
        className="rounded-lg p-4 absolute left-0 top-1/2 transform -translate-y-1/2 ml-4"
      >
        <ChevronLeftIcon className="h-12 w-8" aria-hidden="true" />
      </SplashButton>
      <SplashButton
        onClick={() => {
          if (audio) {
            audio.pause(); // Pause current audio
            setIsPlaying(false);
          }
          setCurrentPage((p) => Math.min(p + 1, story.story_pages.length - 1));
        }}
        className="rounded-lg p-4 absolute right-0 top-1/2 transform -translate-y-1/2 mr-4"
      >
        <ChevronRightIcon className="h-12 w-8" aria-hidden="true" />
      </SplashButton>
      <SplashButton
        onClick={playAudio}
        className="rounded-lg p-4 mt-4 bg-blue-500 text-white"
      >
        {isPlaying ? "Pause" : "Play"}
      </SplashButton>
      <div className="flex justify-center items-center w-full py-1">
        {Array(story.story_pages.length)
          .fill(null)
          .map((_, index) => (
            <SplashButton
              key={index}
              onClick={() => {
                if (audio) {
                  audio.pause(); // Pause current audio
                  setIsPlaying(false);
                }
                setCurrentPage(index);
              }}
              className={`mx-3 p-2 rounded-xl ${
                index === currentPage
                  ? "bg-grey-500 scale-[0.98] ring-indigo-500/70 hover:bg-grey-500 hover:ring-indigo-500/70"
                  : ""
              }`}
            >
              {index + 1}
            </SplashButton>
          ))}
      </div>
    </div>
  );
}
