import Channel from './Channel'

function ChannelList ({ channels, onSelectChannel }) {
  const handleClick = (channelId) => {
    onSelectChannel(channelId)
  }

  let list = 'There is no channels'

  if (channels.length > 0) {
    list = channels.map((c, index) => {
      return (
        <Channel
          key={index}
          id={c.id}
          name={c.name}
          participants={c.sockets.length}
          onClick={handleClick}
        />
      )
    })
  }
  return (
    <div className='channel-list'>
      {list}
    </div>
  )
}

export default ChannelList
