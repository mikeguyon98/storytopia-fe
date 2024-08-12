import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Page from "../components/utils/Page";
import { Heading } from "../components/profile/Heading";
import { Tabs } from "../components/profile/Tabs";
import { Tile } from "../components/Tile";
import { useAuth } from "../AuthProvider";
import { GhostButton } from "../components/buttons/GhostButton";

const BASE_URL = "http://127.0.0.1:8000";
const Profile = () => {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();

  const getEndpoint = (tabId) => {
    switch (tabId) {
      case 1:
        return "/users/me/public_posts";
      case 2:
        return "/users/me/private_posts";
      case 3:
        return "/users/me/saved_posts";
      case 4:
        return "/users/me/liked_posts";
      default:
        return "/users/me/public_posts";
    }
  };

  const fetchStories = async () => {
    console.log(currentUser.reloadUserInfo.localId);
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    const token = await currentUser.getIdToken();
    const endpoint = getEndpoint(selected);
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const {
    data: stories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stories", selected],
    queryFn: fetchStories,
    enabled: !!currentUser,
  });

  const updateUsername = useMutation({
    mutationFn: async (newUsername) => {
      if (!currentUser) throw new Error("User not authenticated");
      const token = await currentUser.getIdToken();

      // Fetch current user details
      const currentUserResponse = await axios.get(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentUserData = currentUserResponse.data;

      // Prepare updated user data
      const updatedUserData = {
        username: newUsername,
        profile_picture: currentUserData.profile_picture || "",
        bio: currentUserData.bio || "",
        followers: currentUserData.followers || [],
        following: currentUserData.following || [],
        liked_books: currentUserData.liked_books || [],
        saved_books: currentUserData.saved_books || [],
        public_books: currentUserData.public_books || [],
        private_books: currentUserData.private_books || [],
      };

      // Send PUT request to update user details
      const response = await axios.put(
        `${BASE_URL}/users/me`,
        updatedUserData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails"]);
      setIsEditModalOpen(false);
      setErrorMessage("");
    },
    onError: (error) => {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.detail === "Username already exists"
      ) {
        setErrorMessage(
          "This username is already taken. Please choose a different one."
        );
      } else {
        setErrorMessage(
          "An error occurred while updating your username. Please try again."
        );
      }
      console.error("Error updating username:", error);
    },
  });

  const handleEditProfile = () => {
    setNewUsername("");
    setErrorMessage("");
    setIsEditModalOpen(true);
  };

  const handleSaveUsername = () => {
    if (newUsername.trim() === "") {
      setErrorMessage("Username cannot be empty.");
      return;
    }
    updateUsername.mutate(newUsername);
  };

  if (!currentUser) {
    return (
      <Page>
        <p>Please log in to view your profile.</p>
      </Page>
    );
  }

  return (
    <Page>
      <Heading onEditProfile={handleEditProfile} />
      <Tabs tabData={TAB_DATA} selected={selected} setSelected={setSelected} />
      <div className="w-full border border-b-1"></div>
      <div className="grid grid-cols-3 gap-1 my-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          stories &&
          stories.map((story) => (
            <Tile
              key={story.id}
              storyId={story.id}
              image={story.story_images[0]}
              likes={story.likes}
              saves={story.saves}
            />
          ))
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            {errorMessage && (
              <div className="bg-red-500 text-white p-2 rounded mb-4">
                {errorMessage}
              </div>
            )}
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New username"
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4 text-white"
            />
            <div className="flex justify-end space-x-2">
              <GhostButton
                onClick={() => {
                  setIsEditModalOpen(false);
                  setErrorMessage("");
                }}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </GhostButton>
              <GhostButton
                onClick={handleSaveUsername}
                disabled={updateUsername.isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              >
                {updateUsername.isLoading ? "Saving..." : "Save"}
              </GhostButton>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

const TAB_DATA = [
  { id: 1, title: "Posts" },
  { id: 2, title: "Private" },
  { id: 3, title: "Saved" },
  { id: 4, title: "Liked" },
];

export default Profile;
