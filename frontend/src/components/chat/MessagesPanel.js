import { useEffect, useRef, useState } from 'react'
import Message from './Message'

function MessagesPanel ({ messages, onSendMessage }) {
  const [text, setText] = useState('')
  const inputText = useRef()

  useEffect(() => {
    if (inputText.current) inputText.current.focus()
  })

  let list = <div className='no-content-message'>There is no messages</div>

  if (messages.length > 0) {
    list = messages.map((m, index) =>
      <Message
        key={index}
        senderName={m.senderName}
        text={m.text}
      />)
  }

  const send = () => {
    if (text && text !== '') {
      onSendMessage(text)
      setText('')
    }
  }
  const handelKeyDown = (e) => {
    if (e.key === 'Enter') send()
  }

  return (
    <div className='messages-panel'>
      <div className='messages-list'>{list}
      </div>
      <div className='messages-input'>
        <input type='text' ref={inputText} onKeyDown={(e) => handelKeyDown(e)} onChange={(e) => setText(e.target.value)} value={text} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}

export default MessagesPanel
