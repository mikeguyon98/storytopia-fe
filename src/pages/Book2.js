import { useAuth } from "../AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

const BASE_URL = "http://127.0.0.1:8000";
export default function Book() {
  const { currentUser } = useAuth();
  const { bookID } = useParams();

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

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (story && story.story_pages.length > 0) {
      setCurrentPage(0); // Reset to the first page when story changes
    }
  }, [story]);

  const nextPage = () => {
    if (story) {
      setCurrentPage((prevPage) =>
        Math.min(prevPage + 1, story.story_pages.length - 1)
      );
    }
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 0, 0));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleFlipStart = () => {
    document.body.style.overflow = "hidden";
  };

  const handleFlipEnd = () => {
    document.body.style.overflow = "auto";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black book-container">
      <div className="text-3xl font-bold text-center my-4">{story.title}</div>
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
  );
}
