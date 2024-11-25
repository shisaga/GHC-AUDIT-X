import React from "react";
import "../../styles/spinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="loader"></div>
    </div>
  );
};

export default LoadingSpinner;
