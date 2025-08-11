// src/components/LoadingScreen.jsx
import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { FaLock } from "react-icons/fa";

export default function LoadingScreen({ progress }) {
  return (
    <div className="flex flex-col justify-center items-center bg-[#111a21] w-screen h-screen">
      {/* WhatsApp Icon */}
      <span className="text-[#3d464a] text-6xl my-12">
        <BsWhatsapp />
      </span>

      {/* Progress bar */}
      <div className="flex flex-col justify-evenly items-center h-[150px]">
        <div className="w-[320px] h-[3px] bg-[#243138] rounded-lg overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center mt-4">
          <h1 className="text-[#c1c6c9] text-lg font-medium">WhatsApp Web Clone</h1>
          <div className="flex items-center text-[#687782] mt-1">
            <FaLock className="text-sm mr-2" />
            <p className="text-sm">End-to-end encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
