const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/users/:page',
    preHandler: session.isAuthenticated,
    handler: controller.getUsersPaged,
    config: { resource_name: 'users', },
  },
  {
    method: 'GET',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: controller.getUserByID,
    config: { resource_name: 'users', },
  },
  {
    method: 'POST',
    url: '/user/',
    preHandler: session.isAuthenticated,
    handler: controller.addNewUser,
    schema: {
      body: {
        type: 'object',
        properties: {
          user_name: { type: 'string' },
          user_pass: { type: 'string' },
          user_email: { type: 'string' },
          user_first_name: { type: 'string' },
        },
        required: [
          'user_name',
          'user_pass',
          'user_email',
          'user_first_name',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'users', },
  },
  {
    method: 'PUT',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: controller.updateUserByID,
    schema: {
      body: {
        type: 'object',
        properties: {
          user_name: { type: 'string' },
          user_email: { type: 'string' },
          user_first_name: { type: 'string' },
        },
        required: [
          'user_name',
          'user_email',
          'user_first_name',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'users', },
  },
  {
    method: 'DELETE',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: controller.deleteUserByID,
    config: { resource_name: 'users', },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
