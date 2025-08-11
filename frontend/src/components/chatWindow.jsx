import React, { useState, useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import { socket } from '../socket'
import api from '../api'

export default function ChatWindow({ conversation, messages }){
  const [localMsgs, setLocalMsgs] = useState(messages)
  const containerRef = useRef()

  useEffect(()=> setLocalMsgs(messages), [messages])

  useEffect(()=>{
    const onNew = (msg) => {
      if(!conversation) return
      if(msg.conversationId === conversation._id){
        setLocalMsgs(prev => [...prev, msg])
      }
    }
    const onUpdate = (msg) => {
      if(!conversation) return
      if(msg.conversationId === conversation._id){
        setLocalMsgs(prev => prev.map(m=> m._id===msg._id? msg : m))
      }
    }
    socket.on('message:new', onNew)
    socket.on('message:updated', onUpdate)
    return ()=>{
      socket.off('message:new', onNew)
      socket.off('message:updated', onUpdate)
    }
  }, [conversation])

  useEffect(()=>{ // scroll to bottom
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
  }, [localMsgs])

  async function handleSend(body){
    if(!conversation) return
    try{
      const { data } = await api.post('/messages', { wa_id: conversation.wa_id, body })
      // optimistic UI: server will emit saved message via socket
    }catch(e){ console.error(e) }
  }

  if(!conversation) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-gray-500">Select a chat to start</div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-300" />
        <div>
          <div className="font-semibold">{conversation.contactName || conversation.wa_id}</div>
          <div className="text-xs text-gray-500">Last seen recently</div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto p-6 bg-[url('/chat-bg.png')] bg-contain">
        {localMsgs.map(m => (
          <MessageBubble key={m._id} message={m} me={m.from=== (import.meta.env.VITE_BUSINESS_NUMBER||'BUSINESS')} />
        ))}
      </div>

      <div className="p-3 border-t">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  )
}