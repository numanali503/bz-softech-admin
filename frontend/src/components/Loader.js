import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <l-spiral size="40" speed="0.9" color="#6644EC"></l-spiral>
    </div>
  );
};

export default Loader;
