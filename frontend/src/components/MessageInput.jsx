import React, { useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BsMic } from "react-icons/bs";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 p-1 bg-[#202C33]"
    >
      {/* Emoji button */}
      <button
        type="button"
        className="text-gray-400 hover:text-gray-300 p-2"
      >
        <BsEmojiSmile size={22} />
      </button>

      {/* Attach button */}
      <button
        type="button"
        className="text-gray-400 hover:text-gray-300 p-2"
      >
        <AiOutlinePaperClip size={22} />
      </button>

      {/* Input */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-1 px-3 py-2 rounded-lg bg-[#2A3942] text-[14px] text-white placeholder-gray-400 outline-none"
      />

      {/* Send or mic */}
      {text.trim() ? (
        <button
          type="submit"
          className="text-green-500 hover:text-green-400 p-2 transition-colors"
          title="Send"
        >
          <RiSendPlaneFill size={22} />
        </button>
      ) : (
        <button
          type="button"
          className="text-gray-400 hover:text-gray-300 p-2"
          title="Record voice"
        >
          <BsMic size={22} />
        </button>
      )}
    </form>
  );
}
