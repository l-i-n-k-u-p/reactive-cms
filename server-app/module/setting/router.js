const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/setting/',
    preHandler: session.isAuthenticated,
    handler: controller.getSettings,
    config: { resource_name: 'settings', },
  },
  {
    method: 'PUT',
    url: '/setting/',
    preHandler: session.isAuthenticated,
    handler: controller.updateSettings,
    schema: {
      body: {
        type: 'object',
        properties: {
          setting_page_title: { type: 'string' },
          setting_items_peer_page: { type: 'number' },
        },
        required: [
          'setting_page_title',
          'setting_items_peer_page',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'settings', },
  },
  {
    method: 'GET',
    url: '/dashboard-settings/',
    preHandler: session.isAuthenticated,
    handler: controller.getDashboardSettings,
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
