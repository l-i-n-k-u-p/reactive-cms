const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/site/',
    preHandler: session.isAuthenticated,
    handler: controller.getSiteSettings,
    config: { resource_name: 'settings', },
  },
  {
    method: 'PUT',
    url: '/site/',
    preHandler: session.isAuthenticated,
    handler: controller.updateSiteSettings,
    schema: {
      body: {
        type: 'object',
        properties: {
          site_name: { type: 'string' },
          site_items_peer_page: { type: 'number' },
          site_url: { type: 'string' },
        },
        required: [
          'site_name',
          'site_items_peer_page',
          'site_url',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'settings', },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
