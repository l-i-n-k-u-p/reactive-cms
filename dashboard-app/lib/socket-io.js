class SocketIO {
  constructor () {
    this.io = io('/', {
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 6000,
      reconnectionAttempts: Infinity,
      transports: ['websocket'],
    })
    this.events = []
    this.socketIOEventManager()
  }
  socketIOEventManager () {
    // this.io.on('connect', () => {
    // })
    // this.io.on('disconnect', (reason) => {
    //   console.log('== socketIO - connect ==', this.io.connected, reason)
    // })
    // this.io.on('reconnecting', (attemptNumber) => {
    //   console.log('== socketIO - reconnecting ==', attemptNumber)
    // })
    // this.io.on('reconnect_error', (error) => {
    //   console.log('== socketIO - reconnect_error ==', error)
    // })
    // this.io.on('reconnect_failed', () => {
    //   console.log('== socketIO - reconnect_failed ==')
    // })
    // this.io.on('error', (error) => {
    //   console.log('== socketIO - error ==', error)
    // })
    // this.io.on('connect_timeout', (timeout) => {
    //   console.log('== socketIO - connect_timeout ==', timeout)
    // })
  }
  registerEvent (event, callback) {
    this.events.push({
      event: event,
      callback: callback,
    })
    this.io.on(event, callback)
  }
}

export default SocketIO
