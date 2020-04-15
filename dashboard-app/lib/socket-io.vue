<script>
const getTransportMethod = () => {
  let transportMethod = ['polling']
  if ('WebSocket' in window)
    transportMethod[0] = 'websocket'
  return transportMethod
}
const IO_INSTANCE = io('/', {
  // path: '/',
  reconnection: true,
  reconnectionDelay: 3000,
  reconnectionDelayMax: 6000,
  reconnectionAttempts: Infinity,
  transports: getTransportMethod(),
})
class IO {
  constructor () {
    // this.socketIOEventManager()
  }
  socketIOEventManager () {
    IO_INSTANCE.on('connect', () => {
      console.log('== socketIO - connect ==')
    })
    IO_INSTANCE.on('disconnect', (reason) => {
      console.log('== socketIO - disconnect ==', reason)
    })
    IO_INSTANCE.on('reconnecting', (attemptNumber) => {
      console.log('== socketIO - reconnecting ==', attemptNumber)
    })
    IO_INSTANCE.on('reconnect_error', (error) => {
      console.log('== socketIO - reconnect_error ==', error)
    })
    IO_INSTANCE.on('reconnect_failed', () => {
      console.log('== socketIO - reconnect_failed ==')
    })
    IO_INSTANCE.on('error', (error) => {
      console.log('== socketIO - error ==', error)
    })
    IO_INSTANCE.on('connect_timeout', (timeout) => {
      console.log('== socketIO - connect_timeout ==', timeout.$events)
    })
  }
  registerEvent (eventName, callback) {
    if (eventName.indexOf('undefined') === 0)
      return

    IO_INSTANCE.on(eventName, callback)
  }
  unregisterEvent (eventName) {
    IO_INSTANCE.off(event)
  }
}
export default {
  IO: IO,
}
</script>
