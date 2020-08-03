const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: controller.getMediaByID,
    config: { resource_name: 'media', },
  },
  {
    method: 'POST',
    url: '/media-file/',
    preHandler: session.isAuthenticated,
    handler: controller.addNewMedia,
    config: { resource_name: 'media', },
    // NOTE: add file validation
  },
  {
    method: 'GET',
    url: '/media-files/:page',
    preHandler: session.isAuthenticated,
    handler: controller.getMediaByPage,
    config: { resource_name: 'media', },
  },
  {
    method: 'PUT',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: controller.updateMediaByID,
    schema: {
      body: {
        type: 'object',
        properties: {
          media_title: { type: 'string' },
        },
        required: [
          'media_title',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'media', },
  },
  {
    method: 'DELETE',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: controller.deleteMediaByID,
    config: { resource_name: 'media', },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
