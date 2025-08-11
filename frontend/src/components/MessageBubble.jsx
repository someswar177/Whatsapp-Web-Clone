import React from "react";

function StatusTicks({ status }) {
  if (!status) return null;
  if (status === "sent") return <span className="ml-1">✓</span>;
  if (status === "delivered") return <span className="ml-1">✓✓</span>;
  if (status === "read") return <span className="ml-1 text-blue-400">✓✓</span>;
  return null;
}

export default function MessageBubble({ message, me }) {
  const time = new Date(
    message.timestamps?.sentAt || message.createdAt
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`mb-3 flex ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          me ? "bg-[#005C4B]" : "bg-[#202C33]"
        } max-w-[60%] px-3 py-2 rounded-lg shadow text-white`}
      >
        <span className="whitespace-pre-wrap break-words text-sm text-gray-100 flex items-end gap-1">
          {message.body}
          <span className="text-[0.65rem] text-white/60 flex items-center flex-shrink-0">
            {time}
            {me && <StatusTicks status={message.status} />}
          </span>
        </span>
      </div>
    </div>
  );
}
