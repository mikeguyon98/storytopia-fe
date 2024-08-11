import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GhostButton } from '../buttons/GhostButton';
import { Settings } from './Settings';
import { Pencil } from '../icons/Pencil';
import { useAuth } from '../../AuthProvider'; // Adjust the import path as needed
import { SettingsMenu } from './SettingsMenu'; // Import the SettingsMenu component
import { signOut } from '../../auth';

const BASE_URL = 'http://localhost:8000'; // Adjust this as needed

export const Heading = () => {
  const { currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchUserDetails = async () => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    const token = currentUser.accessToken;
    const response = await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  const { data: userDetails, isLoading, error } = useQuery({
    queryKey: ['userDetails'],
    queryFn: fetchUserDetails,
    enabled: !!currentUser,
  });

  if (isLoading) return <div>Loading user details...</div>;
  if (error) return <div>Error loading user details: {error.message}</div>;

  const handleSettingsClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className='max-w-lg mx-auto z-1 relative'>
      <div className='flex w-full justify-between items-center gap-4 py-5'>
        <div className='text-zinc-400'>@{userDetails?.username || 'N/A'}</div>
        <GhostButton className={'text-zinc-400'}>
          <div className="mx-auto flex items-start gap-2 w-fit">
            Edit profile
            <Pencil />
          </div>
        </GhostButton>
        <div className='relative'>
          <Settings onClick={handleSettingsClick}/>
          {menuOpen && <SettingsMenu onLogout={signOut} />}
        </div>
      </div>
      <div className='flex w-full justify-between items-center gap-4 py-5'>
        <div className='text-zinc-400'>{userDetails?.public_books.length + userDetails?.private_books.length || 0} Stories</div>
        <div className='text-zinc-400'>{userDetails?.followers.length || 0} Followers</div>
        <div className='text-zinc-400'>{userDetails?.following.length || 0} Following</div>
      </div>
    </div>
  );
};
