import React from 'react'

function shortText(t){ if(!t) return ''; return t.length>40? t.slice(0,40)+'...': t }

export default function ChatListItem({ conv, onClick, active }){
  const last = conv.lastMessage
  return (
    <div
      onClick={onClick}
      className={`px-4 py-4 flex gap-4 items-start cursor-pointer border-b border-white/10 transition-colors ${
        active ? 'bg-[#2A3942]' : 'hover:bg-[#2A3942]'
      }`}
    >
      <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold">
        {conv.contactName ? conv.contactName[0] : 'U'}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="font-medium text-white">{conv.contactName || conv.wa_id}</div>
          <div className="text-xs text-green-500">
            {last
              ? new Date(last.timestamps?.sentAt || last.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </div>
        </div>
        <div className="text-sm text-white/60 mt-1">{shortText(last?.body)}</div>
      </div>
    </div>
  )
}
