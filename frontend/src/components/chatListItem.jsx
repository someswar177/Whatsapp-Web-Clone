import React from 'react'

function shortText(t){ if(!t) return ''; return t.length>40? t.slice(0,40)+'...': t }

export default function ChatListItem({ conv, onClick, active }){
  const last = conv.lastMessage
  return (
    <div onClick={onClick} className={`p-4 flex gap-3 items-start cursor-pointer hover:bg-gray-50 ${active?'bg-gray-100':''}`}>
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">{conv.contactName?conv.contactName[0]:'U'}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="font-medium">{conv.contactName || conv.wa_id}</div>
          <div className="text-xs text-gray-400">{last? new Date(last.timestamps?.sentAt || last.createdAt).toLocaleTimeString() : ''}</div>
        </div>
        <div className="text-sm text-gray-600 mt-1">{shortText(last?.body)}</div>
      </div>
    </div>
  )
}