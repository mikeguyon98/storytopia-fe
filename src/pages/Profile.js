import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Page from '../components/utils/Page';
import { Heading } from '../components/profile/Heading';
import { Tabs } from '../components/profile/Tabs'
import { Tile } from '../components/Tile';
import { useAuth } from '../AuthProvider';
import { GhostButton } from '../components/buttons/GhostButton';

const BASE_URL = 'http://localhost:8000';

const Profile = () => {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState(1);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEndpoint = (tabId) => {
    switch (tabId) {
      case 1: return '/users/me/public_posts';
      case 2: return '/users/me/private_posts';
      case 3: return '/users/me/saved_posts';
      case 4: return '/users/me/liked_posts';
      default: return '/users/me/public_posts';
    }
  };

  useEffect(() => {
    console.log(currentUser)
    const fetchStories = async () => {
      if (!currentUser) {
        setError('User not authenticated');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = currentUser.accessToken;
        const endpoint = getEndpoint(selected);
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStories(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching stories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [currentUser, selected]);

  if (!currentUser) {
    return <Page><p>Please log in to view your profile.</p></Page>;
  }

  return (
    <Page>
      <Heading />
      <Tabs tabData={TAB_DATA} selected={selected} setSelected={setSelected} />
      <div className='w-full border border-b-1'></div>
      <div className="grid grid-cols-3 gap-1 my-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          stories.map((story) => (
            <Tile 
              key={story.id}
              image={story.story_images[0]}
              likes={story.likes}
              saves={story.saves}
            />
          ))
        )}
        <GhostButton onClick={() => console.log(currentUser)}>
          Test
        </GhostButton>
      </div>
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