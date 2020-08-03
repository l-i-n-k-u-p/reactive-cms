const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/dashboard/',
    preHandler: session.isAuthenticated,
    handler: controller.getDashboard,
    config: { resource_name: 'dashboard', },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
