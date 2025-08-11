import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/chatWindow'
import LoadingScreen from './components/LoadingScreen'
import { socket } from './socket'
import api from './api'

export default function App(){
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messagesMap, setMessagesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // fake loading progress
    if (loading) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer)
            setLoading(false)
            return 100
          }
          return Math.min(prev + Math.floor(Math.random() * 10) + 5, 100)
        })
      }, 300)
      return () => clearInterval(timer)
    }
  }, [loading])

  useEffect(()=>{
    if (!loading) {
      fetchConversations()

      socket.on('connect', ()=>{
        console.log('socket connected', socket.id)
      })

      socket.on('message:new', (msg)=>{
        setMessagesMap(prev=>{
          const cid = msg.conversationId
          const arr = prev[cid]?.slice() || []
          arr.push(msg)
          return { ...prev, [cid]: arr }
        })
        setConversations(prev => {
          const idx = prev.findIndex(c=>c._id === msg.conversationId)
          if(idx !== -1){
            const copy = prev.slice()
            copy[idx].lastMessage = msg
            copy.unshift(copy.splice(idx,1)[0])
            return copy
          }
          const newC = { _id: msg.conversationId, wa_id: msg.wa_id, contactName: msg.contactName, lastMessage: msg }
          return [newC, ...prev]
        })
      })

      socket.on('message:updated', (msg)=>{
        setMessagesMap(prev=>{
          const cid = msg.conversationId
          const arr = (prev[cid]||[]).map(m=> m._id===msg._id ? msg : m)
          return {...prev, [cid]: arr}
        })
        setConversations(prev=> prev.map(c => (c._id === msg.conversationId ? { ...c, lastMessage: msg } : c)))
      })

      socket.on('conversation:update', ()=>{
        fetchConversations()
      })

      return ()=>{
        socket.off('connect')
        socket.off('message:new')
        socket.off('message:updated')
        socket.off('conversation:update')
      }
    }
  }, [loading])

  async function fetchConversations(){
    try{
      const { data } = await api.get('/conversations')
      setConversations(data.conversations || [])
    }catch(e){ console.error(e) }
  }

  async function openConversation(conv){
    setActiveConv(conv)
    if(conv && conv._id){
      socket.emit('join', { type: 'conv', id: conv._id })
      if(!messagesMap[conv._id]){
        try{
          const { data } = await api.get(`/conversations/${conv.wa_id}/messages`)
          setMessagesMap(prev=> ({ ...prev, [conv._id]: data.messages }))
        }catch(e){ console.error(e) }
      }
    }
  }

  if (loading) {
    return <LoadingScreen progress={progress} />
  }

  return (
    <div className="h-screen bg-light flex">
      <Sidebar conversations={conversations} onOpen={openConversation} activeConv={activeConv} />
      <ChatWindow conversation={activeConv} messages={(activeConv && messagesMap[activeConv._id])||[]} />
    </div>
  )
}
