class SocketIO {
  constructor (ioServerInstance) {
    this.io = ioServerInstance
    this.init()
  }
  init () {
    this.io.on('connection', clientSocket => {
      this.currentClientSocket = clientSocket
    })
    this.socketIOEventManager()
  }
  socketIOEventManager () {
    // this.io.on('connect', () => {
    //   console.log('== connect ==')
    // })
    // this.io.on('disconnect', (reason) => {
    //   console.log('== socketIO - connect ==', this.io.connected, reason)
    // })
  }
  pushBroadcastMessage (data) {
    this.io.sockets.emit(data.channel, data.data)
  }
}

module.exports = SocketIO
