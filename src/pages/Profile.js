import React, { useState } from 'react';
import Page from '../components/utils/Page';
import { Heading } from '../components/profile/Heading';
import { Tabs } from '../components/profile/Tabs'
import { Tile } from '../components/Tile';
import testing_image from '../testing_image.jpg'
import { useAuth } from '../AuthProvider';
import { GhostButton } from '../components/buttons/GhostButton';

const Profile = () => {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState(1);

  return (
    <Page>
        <Heading />
        <Tabs tabData={TAB_DATA} selected={selected} setSelected={setSelected} />
        <div className='w-full border border-b-1'></div>
        <div class="grid grid-cols-3 gap-1 my-2">
            <Tile image={testing_image} likes={14} saves={12}/>
            <Tile image={testing_image} likes={14} saves={12}/>
            <Tile image={testing_image} likes={14} saves={12}/>
            <Tile image={testing_image} likes={14} saves={12}/>
            <Tile image={testing_image} likes={14} saves={12}/>
            <Tile image={testing_image} likes={14} saves={12}/>
            <Tile image={testing_image} likes={14} saves={12}/>
            <Tile image={testing_image} likes={14} saves={12}/>
            <Tile image={testing_image} likes={14} saves={12}/>
            <GhostButton onClick={() => console.log(currentUser)}>
                Test
            </GhostButton>
        </div>
    </Page>
  );
};

const TAB_DATA = [
    {
      id: 1,
      title: "Posts",
    },
    {
      id: 2,
      title: "Private",
    },
    {
      id: 3,
      title: "Saved",
    },
    {
      id: 4,
      title: "Liked",
    },
];

export default Profile;