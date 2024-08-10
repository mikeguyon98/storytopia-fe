import React from 'react';

const Page = ({ children }) => {
  return (
    <div className="mt-16 mx-4 md:mx-8 lg:mx-16 w-full">
      {children}
    </div>
  );
};

export default Page;