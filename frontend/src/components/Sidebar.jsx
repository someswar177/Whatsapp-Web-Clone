import React from "react";
import {
  FaCircleNotch,
  FaCommentAlt,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa";

export default function Sidebar({ conversations, onOpen, activeConv, isMobile }) {
  return (
    <div
      className={`${isMobile ? "w-full" : "w-[35%]"} border-r border-[#202C33] flex flex-col bg-[#111B21]`}
    >
      {/* Header */}
      <div
        className={`
    flex items-center justify-between 
    ${isMobile ? "p-2" : "p-3"} 
    bg-[#202C33] border-b border-[#202C33]
  `}
      >
        <h1
          className={`text-white font-bold py-0.5 ${isMobile ? "text-xl" : "text-3xl"}`}
        >
          Chats
        </h1>

        {/* Icons wrapper */}
        <div className="flex items-center gap-3 sm:gap-4 text-gray-300">
          {[FaCircleNotch, FaCommentAlt, FaEllipsisV].map((Icon, idx) => (
            <button
              key={idx}
              className="p-2 rounded-full hover:bg-[#2A3942] transition-colors"
            >
              <Icon size={isMobile ? 18 : 20} />
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div
        className={`bg-[#111B21] border-b border-[#202C33] ${isMobile ? "p-1" : "p-2"}`}
      >
        <div className="flex items-center bg-[#202C33] rounded-lg px-3 py-2">
          <FaSearch
            className={`text-gray-400 mr-3 ${isMobile ? "text-sm" : ""}`}
          />
          <input
            type="text"
            placeholder="Search or start new chat"
            className={`bg-transparent outline-none w-full ${isMobile ? "text-xs" : "text-sm"
              } text-white placeholder-gray-400`}
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
              className={`flex items-center cursor-pointer border-b border-white/10 transition-colors duration-150 ease-in-out
    ${isActive ? "bg-[#2F3B43] hover:bg-[#3B4A54]" : "hover:bg-[#2A3942]"}
    ${isMobile ? "px-3 py-2" : "px-4 py-3"}
  `}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    conv.contactName || conv.wa_id
                  )}&background=364147&color=fff`}
                  alt="Avatar"
                  className={`rounded-full border-2 ${isActive ? "border-[#25D366]" : "border-transparent"
                    } ${isMobile ? "w-10 h-10" : "w-12 h-12"}`}
                />
              </div>

              <div className="flex-1 min-w-0 ml-3 sm:ml-4">
                <div className="flex justify-between items-center">
                  <h2
                    className={`truncate font-semibold text-white ${isMobile ? "text-sm" : "text-[15px]"
                      }`}
                  >
                    {conv.contactName || conv.wa_id}
                  </h2>
                  {lastMsgTime && (
                    <span
                      className={`flex-shrink-0 text-green-500 ${isMobile ? "text-[10px]" : "text-xs"
                        }`}
                    >
                      {new Date(lastMsgTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                <p
                  className={`truncate text-white/60 ${isMobile ? "text-[11px]" : "text-[13px]"
                    }`}
                >
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
