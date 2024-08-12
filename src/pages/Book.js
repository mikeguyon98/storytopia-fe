import { useAuth } from "../AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import HTMLFlipBook from "react-pageflip";
import { FaLock, FaLockOpen } from "react-icons/fa";

const BASE_URL = "https://storytopia-fastapi-kgdwevjo6a-ue.a.run.app";

export default function Book() {
  const { currentUser } = useAuth();
  const { bookID } = useParams();
  const queryClient = useQueryClient();

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

  const { data: story, isLoading, error } = useQuery({
    queryKey: ["stories", bookID],
    queryFn: fetchStory,
    enabled: !!currentUser,
  });

  const togglePrivacy = useMutation({
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

  const handleFlipStart = () => {
    document.body.style.overflow = "hidden";
  };

  const handleFlipEnd = () => {
    document.body.style.overflow = "auto";
  };

  const handleTogglePrivacy = () => {
    togglePrivacy.mutate();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-black pt-20 pb-10 px-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">{story.title}</h1>
        <div className="mb-8 overflow-hidden flex justify-center">
          <HTMLFlipBook
            width={800}
            height={600}
            className="flipbook"
            onFlip={handleFlipStart}
            onAnimationEnd={handleFlipEnd}
          >
            {story.story_images.map((image, index) => (
              <div className="page" key={index}>
                <img src={image} alt={`Page ${index + 1}`} />
                <p>{story.story_pages[index]}</p>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleTogglePrivacy}
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            disabled={togglePrivacy.isLoading}
          >
            {story.private ? <FaLock className="mr-2" /> : <FaLockOpen className="mr-2" />}
            {story.private ? "Private" : "Public"}
          </button>
        </div>
      </div>
    </div>
  );
}