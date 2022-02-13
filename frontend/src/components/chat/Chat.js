import { useEffect, useState } from 'react'
import socketClient from 'socket.io-client'
import { loadChannels } from '../../services/Api'
import './chat.scss'
import MessagesPanel from './MessagesPanel'
import ChannelList from './ChannelList'
// Socket ENDPOINT
const SOCKET_ENDPOINT = 'http://localhost:4000'
const socket = socketClient(SOCKET_ENDPOINT)

function Chat () {
  const [messages, setMessages] = useState([])
  const [channels, setChannels] = useState([])
  const [currentChannelId, setCurrentChannelId] = useState()

  useEffect(() => {
    // listen socket event
    socket.on('connected', () => {
      // collect channel list
      (async () => {
        const _channels = await loadChannels()
        setChannels(_channels)
        handleSelectChannel(_channels[0].id) // auto select first channel
      })()

      console.log('Connected to server')

      socket.on('message', message => {
        setMessages(_messages => [..._messages, message])
      })

      socket.on('channel', (channel) => {
        setChannels(_channels => {
          return _channels.map(c => {
            if (c.id === channel.id) return channel
            return c
          })
        })
      })
    })
  }, [])

  const handleSendMessage = (text) => {
    socket.emit('send-message', {
      channelId: currentChannelId,
      text: text,
      senderName: socket.id,
      date: Date.now()
    })
  }

  const handleSelectChannel = (channelId) => {
    setMessages([])
    socket.emit('channel-join', channelId)
    setCurrentChannelId(channelId)
  }

  return (
    <div className='chat-app'>
      <ChannelList channels={channels} onSelectChannel={handleSelectChannel} />
      <MessagesPanel messages={messages} onSendMessage={handleSendMessage} />
    </div>
  )
}

export default Chat
