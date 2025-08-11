import React from "react";
import {
  FaCircleNotch,
  FaCommentAlt,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa";

export default function Sidebar({ conversations, onOpen, activeConv }) {
  return (
    <div className="w-[35%] border-r border-[#202C33] flex flex-col bg-[#111B21]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-[#202C33] border-b border-[#202C33]">
        {/* <img
          src={`https://ui-avatars.com/api/?name=You&background=2A3942&color=fff`}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        /> */}
        <h1 className="text-white text-3xl font-bold">Chats</h1>
        <div className="flex space-x-4 text-gray-300">
          <FaCircleNotch className="cursor-pointer hover:text-white transition-colors" size={18} />
          <FaCommentAlt className="cursor-pointer hover:text-white transition-colors" size={18} />
          <FaEllipsisV className="cursor-pointer hover:text-white transition-colors" size={18} />
        </div>
      </div>

      {/* Search */}
      <div className="p-2 bg-[#111B21] border-b border-[#202C33]">
        <div className="flex items-center bg-[#202C33] rounded-lg px-3 py-2">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const isActive = activeConv && activeConv._id === conv._id;

          let lastMsgText = "";
          if (conv.lastMessage?.body) {
            lastMsgText = conv.lastMessage.body;
          } else if (conv.lastMessage?.text) {
            lastMsgText = conv.lastMessage.text;
          } else if (conv.lastMessage?.type === "image") {
            lastMsgText = "📷 Photo";
          } else if (conv.lastMessage?.type) {
            lastMsgText = conv.lastMessage.type;
          }

          const lastMsgTime =
            conv.lastMessage?.createdAt || conv.lastMessage?.timestamp;

          return (
            <div
              key={conv._id}
              onClick={() => onOpen(conv)}
              className={`flex items-center px-4 py-3 cursor-pointer border-b border-white/10 transition-colors duration-150 ease-in-out ${isActive ? "bg-[#2F3B43] hover:bg-[#3B4A54]" : "hover:bg-[#2A3942]"
                }`}
            >
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    conv.contactName || conv.wa_id
                  )}&background=364147&color=fff`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-[#111B21]"
                />
              </div>
              <div className="flex-1 min-w-0 ml-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-[15px] font-semibold text-white truncate">
                    {conv.contactName || conv.wa_id}
                  </h2>
                  {lastMsgTime && (
                    <span className="text-xs text-green-500 flex-shrink-0">
                      {new Date(lastMsgTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-white/60 truncate">
                  {lastMsgText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
