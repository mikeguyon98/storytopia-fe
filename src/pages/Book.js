import { useAuth } from "../AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import React from "react";
import HTMLFlipBook from "react-pageflip";
import { FaLock, FaLockOpen } from "react-icons/fa";

const BASE_URL = "http://localhost:8000";

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

  const handleTogglePrivacy = () => {
    togglePrivacy.mutate();
  };

  if (isLoading) {
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
        <div className="mb-8 overflow-hidden flex justify-center">
          <HTMLFlipBook
            width={800}
            height={600}
            showCover={false}
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            className="flipbook"
          >
            {story.story_images.map((image, index) => (
              <div className="page" key={index}>
                <img src={image} alt={`Page ${index + 1}`} />
                <p>{story.story_pages[index]}</p>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
        {isCurrentUserAuthor && (
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
        )}
      </div>
    </div>
  );
}