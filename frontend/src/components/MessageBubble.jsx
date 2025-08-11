import React from 'react'

function StatusTicks({ status }){
  // status: sent | delivered | read
  if(!status) return null
  if(status === 'sent') return <span className="ml-2">✓</span>
  if(status === 'delivered') return <span className="ml-2">✓✓</span>
  if(status === 'read') return <span className="ml-2 text-blue-500">✓✓</span>
  return null
}

export default function MessageBubble({ message, me }){
  const time = new Date(message.timestamps?.sentAt || message.createdAt).toLocaleTimeString()
  return (
    <div className={`mb-3 flex ${me? 'justify-end' : 'justify-start'}`}>
      <div className={`${me? 'bg-[#DCF8C6] text-right' : 'bg-white'} max-w-[60%] p-3 rounded-lg shadow` }>
        <div className="whitespace-pre-wrap">{message.body}</div>
        <div className="text-xs text-gray-500 mt-1 flex items-center justify-end">
          <span>{time}</span>
          {me && <StatusTicks status={message.status} />}
        </div>
      </div>
    </div>
  )
}