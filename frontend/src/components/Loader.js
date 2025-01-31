import React from "react";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <l-line-spinner
        size="40"
        stroke="3"
        speed="1"
        color="#793BED"
      ></l-line-spinner>
    </div>
  );
};

export default Loader;
