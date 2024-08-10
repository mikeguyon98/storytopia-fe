import React from 'react';
import { MaxWidthWrapper } from './MaxWidthWrapper';

const Page = ({ children }) => {
  return (
    <MaxWidthWrapper>
        <div className="mt-16">
        {children}
        </div>
    </MaxWidthWrapper>
  );
};

export default Page;