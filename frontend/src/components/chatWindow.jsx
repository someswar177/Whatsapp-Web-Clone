import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { socket } from "../socket";
import api from "../api";
import { MdSearch } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import chatBg from "../assets/chat-bg.webp";

export default function ChatWindow({ conversation, messages }) {
  const [localMsgs, setLocalMsgs] = useState(messages || []);
  const containerRef = useRef();

  useEffect(() => {
    setLocalMsgs(messages || []);
  }, [messages]);

  useEffect(() => {
    if (!conversation) return;

    const onNew = (msg) => {
      if (!conversation) return;
      if (msg.conversationId !== conversation._id) return;

      setLocalMsgs((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const onUpdate = (msg) => {
      if (!conversation) return;
      if (msg.conversationId !== conversation._id) return;

      setLocalMsgs((prev) =>
        prev.map((m) => (m._id === msg._id ? msg : m))
      );
    };

    socket.on("message:new", onNew);
    socket.on("message:updated", onUpdate);

    return () => {
      socket.off("message:new", onNew);
      socket.off("message:updated", onUpdate);
    };
  }, [conversation]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [localMsgs, conversation]);

  async function handleSend(body) {
    if (!conversation) return;
    try {
      await api.post("/messages", {
        wa_id: conversation.wa_id,
        body,
      });
    } catch (e) {
      console.error("send message error:", e);
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0B141A] text-gray-400">
        Select a chat to start
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B141A]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#202C33] bg-[#202C33]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
            {conversation.contactName?.[0] || conversation.wa_id?.[0] || "?"}
          </div>
          <div>
            <div className="font-semibold text-white">
              {conversation.contactName || conversation.wa_id}
            </div>
            <div className="text-xs text-gray-400">Last seen recently</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-400">
          <button className="p-2 rounded hover:bg-[#2A3942]">
            <MdSearch size={18} />
          </button>
          <button className="p-2 rounded hover:bg-[#2A3942]">
            <HiDotsVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-6"
        style={{
          backgroundImage: `url(${chatBg})`,
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      >
        {localMsgs.map((m) => (
          <MessageBubble
            key={m._id}
            message={m}
            me={m.from === (import.meta.env.VITE_BUSINESS_NUMBER || "BUSINESS")}
          />
        ))}
      </div>

      {/* Bottom input */}
      {/* Bottom input */}
      <div className="p-3 border-t border-[#202C33] bg-[#202C33]">
        <div className="max-w-full mx-auto flex items-center gap-3">
          <div className="flex-1">
            <MessageInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}
