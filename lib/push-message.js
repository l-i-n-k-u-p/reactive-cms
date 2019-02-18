const Pusher = require('pusher')


const pushMessage = new Pusher({
  appId: '647886',
  key: 'c6e6a7cab15691ed1fab',
  secret: 'ed2265d40da41495254a',
  cluster: 'us2',
  encrypted: true,
})

module.exports = {
  pushMessage: pushMessage,
}
