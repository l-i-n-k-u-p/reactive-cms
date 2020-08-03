const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'POST',
    url: '/login/',
    handler: controller.login,
    schema: {
      body: {
        type: 'object',
        properties: {
          user_name: { type: 'string' },
          user_pass: { type: 'string' },
        },
        required: [
          'user_name',
          'user_pass',
        ],
      },
    },
    attachValidation: true,
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
