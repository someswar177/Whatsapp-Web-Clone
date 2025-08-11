import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/chatWindow'
import LoadingScreen from './components/LoadingScreen'
import { socket } from './socket'
import api from './api'

export default function App() {
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messagesMap, setMessagesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer)
            setLoading(false)
            setShowPopup(true)
            return 100
          }
          return Math.min(prev + Math.floor(Math.random() * 10) + 5, 100)
        })
      }, 300)
      return () => clearInterval(timer)
    }
  }, [loading])

  useEffect(() => {
    if (!loading) {
      fetchConversations()

      socket.on('connect', () => {
        console.log('socket connected', socket.id)
      })

      socket.on('message:new', (msg) => {
        setMessagesMap(prev => {
          const cid = msg.conversationId
          const arr = prev[cid]?.slice() || []
          arr.push(msg)
          return { ...prev, [cid]: arr }
        })
        setConversations(prev => {
          const idx = prev.findIndex(c => c._id === msg.conversationId)
          if (idx !== -1) {
            const copy = prev.slice()
            copy[idx].lastMessage = msg
            copy.unshift(copy.splice(idx, 1)[0])
            return copy
          }
          const newC = { _id: msg.conversationId, wa_id: msg.wa_id, contactName: msg.contactName, lastMessage: msg }
          return [newC, ...prev]
        })
      })

      socket.on('message:updated', (msg) => {
        setMessagesMap(prev => {
          const cid = msg.conversationId
          const arr = (prev[cid] || []).map(m => m._id === msg._id ? msg : m)
          return { ...prev, [cid]: arr }
        })
        setConversations(prev => prev.map(c => (c._id === msg.conversationId ? { ...c, lastMessage: msg } : c)))
      })

      socket.on('conversation:update', () => {
        fetchConversations()
      })

      return () => {
        socket.off('connect')
        socket.off('message:new')
        socket.off('message:updated')
        socket.off('conversation:update')
      }
    }
  }, [loading])

  async function fetchConversations() {
    try {
      const { data } = await api.get('/conversations')
      setConversations(data.conversations || [])
    } catch (e) { console.error(e) }
  }

  async function openConversation(conv) {
    setActiveConv(conv)
    if (conv && conv._id) {
      socket.emit('join', { type: 'conv', id: conv._id })
      if (!messagesMap[conv._id]) {
        try {
          const { data } = await api.get(`/conversations/${conv.wa_id}/messages`)
          setMessagesMap(prev => ({ ...prev, [conv._id]: data.messages }))
        } catch (e) { console.error(e) }
      }
    }
  }

  function handleBack() {
    setActiveConv(null)
  }

  if (loading) {
    return <LoadingScreen progress={progress} />
  }

  return (
    <div className="h-screen bg-light flex relative">
      {/* Desktop Layout */}
      {!isMobile && (
        <>
          <Sidebar
            conversations={conversations}
            onOpen={openConversation}
            activeConv={activeConv}
          />
          <ChatWindow
            conversation={activeConv}
            messages={(activeConv && messagesMap[activeConv._id]) || []}
          />
        </>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <>
          {!activeConv ? (
            <Sidebar
              conversations={conversations}
              onOpen={openConversation}
              activeConv={activeConv}
              isMobile={true}
            />
          ) : (
            <ChatWindow
              conversation={activeConv}
              messages={(activeConv && messagesMap[activeConv._id]) || []}
              onBack={handleBack}
              isMobile={true}
            />
          )}
        </>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Greetings 👋</h2>
            <p className="text-gray-700 mb-4">
              Welcome to our <strong>WhatsApp Web clone!</strong>:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Lightweight demo built with Webhook Payload Processor using <strong>socket io</strong>.</li>
              <li>You can send and view messages.</li>
            </ul>
            <p className="text-gray-700">
              Future upgrade → <strong>multi-user platform</strong> with authentication and real-time features.
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
