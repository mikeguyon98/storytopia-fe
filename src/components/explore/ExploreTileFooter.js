import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SolidBookmark } from "../icons/SolidBookmark";
import { Bookmark } from "../icons/Bookmark";
import { SolidHeart } from "../icons/SolidHeart";
import { Heart } from "../icons/Heart";
import { useAuth } from "../../AuthProvider";
import axios from "axios";
import { useState } from "react";

// const BASE_URL = "http://127.0.0.1:8000"
const BASE_URL = "https://storytopia-fastapi-kgdwevjo6a-ue.a.run.app"

export const ExploreTileFooter = ({ userId, likes, saves, postId }) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [localLikes, setLocalLikes] = useState(likes);
  const [localSaves, setLocalSaves] = useState(saves);

  const likePost = async () => {
    const response = await axios.post(
      `${BASE_URL}/stories/like`,
      null,
      {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        params: {
          story_id: postId,
        },
      }
    );
    return response.data;
  };

  const unlikePost = async () => {
    const response = await axios.post(
      `${BASE_URL}/stories/unlike`,
      null,
      {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        params: {
          story_id: postId,
        },
      }
    );
    return response.data;
  };

  const likeMutation = useMutation({
    mutationFn: likePost,
    onMutate: () => {
      setLocalLikes([...localLikes, userId]); // Optimistically update the likes UI
    },
    onError: () => {
      setLocalLikes(likes); // Rollback to original likes if mutation fails
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["post", postId]);
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: unlikePost,
    onMutate: () => {
      setLocalLikes(localLikes.filter((id) => id !== userId)); // Optimistically update the likes UI
    },
    onError: () => {
      setLocalLikes(likes); // Rollback to original likes if mutation fails
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["post", postId]);
    },
  });

  const handleLikeClick = () => {
    if (localLikes.includes(userId)) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const savePost = async () => {
    const response = await axios.post(
      `${BASE_URL}/stories/save`,
      null,
      {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        params: {
          story_id: postId,
        },
      }
    );
    return response.data;
  };

  const unsavePost = async () => {
    const response = await axios.post(
      `${BASE_URL}/stories/unsave`,
      null,
      {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        params: {
          story_id: postId,
        },
      }
    );
    return response.data;
  };

  const saveMutation = useMutation({
    mutationFn: savePost,
    onMutate: () => {
      setLocalSaves([...localSaves, userId]); // Optimistically update the saves UI
    },
    onError: () => {
      setLocalSaves(saves); // Rollback to original saves if mutation fails
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["post", postId]);
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: unsavePost,
    onMutate: () => {
      setLocalSaves(localSaves.filter((id) => id !== userId)); // Optimistically update the saves UI
    },
    onError: () => {
      setLocalSaves(saves); // Rollback to original saves if mutation fails
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["post", postId]);
    },
  });

  const handleSaveClick = () => {
    if (localSaves.includes(userId)) {
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-end pt-6">
      <div className="flex flex-row justify-between w-full">
        {localLikes.includes(userId) ? (
          <button onClick={handleLikeClick}>
            <SolidHeart />
          </button>
        ) : (
          <button onClick={handleLikeClick}>
            <Heart />
          </button>
        )}
        {localSaves.includes(userId) ? (
          <button onClick={handleSaveClick}>
            <SolidBookmark />
          </button>
        ) : (
          <button onClick={handleSaveClick}>
            <Bookmark />
          </button>
        )}
      </div>
      <div className="flex flex-row justify-between w-full">
        <div>{localLikes.length} likes</div>
        <div>{localSaves.length} saves</div>
      </div>
    </div>
  );
};
