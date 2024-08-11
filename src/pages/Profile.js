import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Page from '../components/utils/Page';
import { Heading } from '../components/profile/Heading';
import { Tabs } from '../components/profile/Tabs'
import { Tile } from '../components/Tile';
import { useAuth } from '../AuthProvider';

const BASE_URL = 'http://localhost:8000';

const Profile = () => {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState(1);

  const getEndpoint = (tabId) => {
    switch (tabId) {
      case 1: return '/users/me/public_posts';
      case 2: return '/users/me/private_posts';
      case 3: return '/users/me/saved_posts';
      case 4: return '/users/me/liked_posts';
      default: return '/users/me/public_posts';
    }
  };

  const fetchStories = async () => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    const token = currentUser.accessToken;
    const endpoint = getEndpoint(selected);
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['stories', selected],
    queryFn: fetchStories,
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return <Page><p>Please log in to view your profile.</p></Page>;
  }

  return (
    <Page>
      <Heading currentUser = {currentUser}/>
      <Tabs tabData={TAB_DATA} selected={selected} setSelected={setSelected} />
      <div className='w-full border border-b-1'></div>
      <div className="grid grid-cols-3 gap-1 my-2">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          stories && stories.map((story) => (
            <Tile 
              key={story.id}
              image={story.story_images[0]}
              likes={story.likes}
              saves={story.saves}
            />
          ))
        )}
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