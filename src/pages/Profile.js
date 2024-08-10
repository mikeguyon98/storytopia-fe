import React, { useState } from 'react';
import Page from '../components/utils/Page';
import { Heading } from '../components/profile/Heading';
import { Tabs } from '../components/profile/Tabs'

const Profile = () => {
  const [selected, setSelected] = useState(1);

  return (
    <Page>
        <Heading />
        <Tabs tabData={TAB_DATA} selected={selected} setSelected={setSelected} />
        <div className='w-full border border-b-1'></div>
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