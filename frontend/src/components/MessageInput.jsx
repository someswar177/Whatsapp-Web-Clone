import React, { useState } from 'react'

export default function MessageInput({ onSend }){
  const [text, setText] = useState('')
  function submit(e){
    e.preventDefault()
    if(!text.trim()) return
    onSend(text.trim())
    setText('')
  }
  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" className="flex-1 p-3 rounded-full border" />
      <button className="px-4 py-2 bg-whatsapp text-white rounded-full">Send</button>
    </form>
  )
}