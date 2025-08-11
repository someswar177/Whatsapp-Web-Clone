import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/chatWindow'
import { socket } from './socket'
import api from './api'

export default function App(){
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messagesMap, setMessagesMap] = useState({})

  useEffect(()=>{
    fetchConversations()

    socket.on('connect', ()=>{
      console.log('socket connected', socket.id)
      // join user-wide room? We don't have login; don't auto-join any user rooms
    })

    socket.on('message:new', (msg)=>{
      // append message into messagesMap
      setMessagesMap(prev=>{
        const cid = msg.conversationId
        const arr = prev[cid]?.slice() || []
        arr.push(msg)
        return { ...prev, [cid]: arr }
      })
      // update conversation list
      setConversations(prev => {
        // find conv
        const idx = prev.findIndex(c=>c._id === msg.conversationId)
        if(idx !== -1){
          const copy = prev.slice()
          copy[idx].lastMessage = msg
          // move to top
          copy.unshift(copy.splice(idx,1)[0])
          return copy
        }
        // if not found, create a new convo preview
        const newC = { _id: msg.conversationId, wa_id: msg.wa_id, contactName: msg.contactName, lastMessage: msg }
        return [newC, ...prev]
      })
    })

    socket.on('message:updated', (msg)=>{
      // update message in messagesMap
      setMessagesMap(prev=>{
        const cid = msg.conversationId
        const arr = (prev[cid]||[]).map(m=> m._id===msg._id ? msg : m)
        return {...prev, [cid]: arr}
      })

      setConversations(prev=> prev.map(c => (c._id === msg.conversationId ? { ...c, lastMessage: msg } : c)))
    })

    socket.on('conversation:update', (payload)=>{
      // optional: reorder convs
      // we'll fetch conversations again (simple approach)
      fetchConversations()
    })

    return ()=>{
      socket.off('connect')
      socket.off('message:new')
      socket.off('message:updated')
      socket.off('conversation:update')
    }
  }, [])

  async function fetchConversations(){
    try{
      const { data } = await api.get('/conversations')
      setConversations(data.conversations || [])
    }catch(e){ console.error(e) }
  }

  async function openConversation(conv){
    setActiveConv(conv)
    // join room on socket
    if(conv && conv._id){
      socket.emit('join', { type: 'conv', id: conv._id })
      // fetch messages if not loaded
      if(!messagesMap[conv._id]){
        try{
          const { data } = await api.get(`/conversations/${conv.wa_id}/messages`)
          setMessagesMap(prev=> ({ ...prev, [conv._id]: data.messages }))
        }catch(e){ console.error(e) }
      }
    }
  }

  return (
    <div className="h-screen bg-light flex">
      <Sidebar conversations={conversations} onOpen={openConversation} activeConv={activeConv} />
      <ChatWindow conversation={activeConv} messages={(activeConv && messagesMap[activeConv._id])||[]} />
    </div>
  )
}