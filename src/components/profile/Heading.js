import React from 'react';
import { BubbleButton } from '../buttons/BubbleButton';
import { SplashButton } from '../buttons/SplashButton';
import { GhostButton } from '../buttons/GhostButton';
import { Settings } from './Settings'
import { Pencil } from '../icons/Pencil';

export const Heading = () => {
  
    return (
      <div className='max-w-lg mx-auto z-1'>
        <div className='flex w-full justify-between items-center gap-4 py-5'>
            <div className='text-zinc-400'>mike_guyon</div>
                <GhostButton className={'text-zinc-400'} >
                    <div className="mx-auto flex items-start gap-2 w-fit">
                        Edit profile
                        <Pencil />
                    </div>
                </GhostButton>
            <Settings />
        </div>
        <div className='flex w-full justify-between items-center gap-4 py-5'>
            <div className='text-zinc-400'>18 Stories</div>
            <div className='text-zinc-400'>11 Followers</div>
            <div className='text-zinc-400'>12 Following</div>
        </div>
        
      </div>
    );
  };