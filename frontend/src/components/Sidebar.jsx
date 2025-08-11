import React from 'react'
import ChatListItem from './ChatListItem'

export default function Sidebar({ conversations, onOpen, activeConv }){
  return (
    <aside className="w-96 bg-white border-r h-full flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b">
        <div className="w-12 h-12 rounded-full bg-green-500" />
        <div className="flex-1">
          <div className="font-semibold">Business</div>
          <div className="text-xs text-gray-500">Online</div>
        </div>
      </div>

      <div className="p-2">
        <input placeholder="Search or start new chat" className="w-full p-2 rounded bg-gray-100" />
      </div>

      <div className="flex-1 overflow-auto">
        {conversations.map(conv => (
          <ChatListItem key={conv._id} conv={conv} onClick={()=>onOpen(conv)} active={activeConv?._id===conv._id} />
        ))}
      </div>
    </aside>
  )
}