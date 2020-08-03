const session = require('../../lib/session')
const controller = require('./controller')



let routes = [
  {
    method: 'GET',
    url: '/views-all/:page',
    preHandler: session.isAuthenticated,
    handler: controller.getViewNames,
    config: { resource_name: 'roles', },
  },
  {
    method: 'GET',
    url: '/view/:id',
    preHandler: session.isAuthenticated,
    handler: controller.getViewByID,
    config: { resource_name: 'views', },
  },
  {
    method: 'POST',
    url: '/view/',
    preHandler: session.isAuthenticated,
    handler: controller.addNewView,
    schema: {
      body: {
        type: 'object',
        properties: {
          view_name: { type: 'string' },
          view_description: { type: 'string' },
        },
        required: [
          'view_name',
          'view_description',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'views', },
  },
  {
    method: 'GET',
    url: '/views/:page',
    preHandler: session.isAuthenticated,
    handler: controller.getViewsByPage,
    config: { resource_name: 'views', },
  },
  {
    method: 'PUT',
    url: '/view/:id',
    preHandler: session.isAuthenticated,
    handler: controller.updateViewByID,
    schema: {
      body: {
        type: 'object',
        properties: {
          view_name: { type: 'string' },
          view_description: { type: 'string' },
        },
        required: [
          'view_name',
          'view_description',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'views', },
  },
  {
    method: 'DELETE',
    url: '/view/:id',
    preHandler: session.isAuthenticated,
    handler: controller.deleteViewByID,
    config: { resource_name: 'views', },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
