const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

// server configuration
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const CHANNELS_CONFIG = [
  {
    id: 0,
    name: 'Global Chat',
    sockets: []
  },
  {
    id: 1,
    name: 'Channel 1',
    sockets: []
  },
  {
    id: 2,
    name: 'Channel 2',
    sockets: []
  }
]

/**
 * Routes
 */

app.get('/', (req, res) => {
  res.send('Hello world !')
})

app.get('/channels', (req, res) => {
  res.json(CHANNELS_CONFIG)
})

io.on('connection', (socket) => {
  console.log(`client connected on socket ${socket.id}`)

  socket.emit('connected', null)

  socket.on('send-message', message => {
    CHANNELS_CONFIG.forEach(c => {
      // find targeted channel
      if (c.id === message.channelId) {
        c.sockets.forEach(socketId => {
          // send message to channel users
          io.to(socketId).emit('message', message)
        })
      }
    })
  })

  socket.on('channel-join', channelId => {
    CHANNELS_CONFIG.forEach((c) => {
      // find target channel
      if (c.id === channelId) {
        // if user not already connected
        if (c.sockets.indexOf(socket.id) === -1) {
          c.sockets.push(socket.id)
          io.emit('channel', c)
        }
      } else {
        // if user connected in another channel
        const index = c.sockets.indexOf(socket.id)
        if (index !== -1) {
          c.sockets.splice(index, 1)
          io.emit('channel', c)
        }
      }
    })
  })

  socket.on('disconnect', () => {
    console.log(`client disconnected ${socket.id}`)
    CHANNELS_CONFIG.forEach((c) => {
      const index = c.sockets.indexOf(socket.id)
      if (index !== -1) {
        c.sockets.splice(index, 1)
        io.emit('channel', c)
      }
    })
  })
})

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000')
})
