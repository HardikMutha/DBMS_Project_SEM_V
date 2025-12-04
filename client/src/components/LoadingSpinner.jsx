import React from "react";

const LoadingSpinner = ({ size = "default", text = "" }) => {
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    default: "w-10 h-10 border-3",
    large: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-slate-200 border-t-emerald-500 rounded-full animate-spin`} />
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
