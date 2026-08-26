import React from "react";
import {
  BeatLoader,
  PulseLoader,
  ClipLoader,
  SyncLoader,
} from "react-spinners";
import { FaSpinner } from "react-icons/fa";

// Minimal inline version
function LoadingSpinner({
  size = 20,
  color = "#c4511b",
  type = "beat",
  showText = true,
}) {
  return (
    <div className="flex items-center justify-center space-x-3 p-3">
      <FaSpinner size={30} className="animate-spin text-primary text-xl mr-2" />
    </div>
  );
}

export default LoadingSpinner;
