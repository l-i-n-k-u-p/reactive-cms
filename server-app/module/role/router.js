const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/role/:id',
    preHandler: session.isAuthenticated,
    handler: controller.getRoleByID,
    config: { resource_name: 'roles', },
  },
  {
    method: 'POST',
    url: '/role/',
    preHandler: session.isAuthenticated,
    handler: controller.addNewRole,
    schema: {
      body: {
        type: 'object',
        properties: {
          role_name: { type: 'string' },
        },
        required: [
          'role_name',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'roles', },
  },
  {
    method: 'GET',
    url: '/roles/:page',
    preHandler: session.isAuthenticated,
    handler: controller.getRolesByPage,
    config: { resource_name: 'roles', },
  },
  {
    method: 'PUT',
    url: '/role/:id',
    preHandler: session.isAuthenticated,
    handler: controller.updateRoleByID,
    schema: {
      body: {
        type: 'object',
        properties: {
          role_name: { type: 'string' },
          role_resources: { type: 'array' },
          role_user_ref: { type: 'string' },
        },
        required: [
          'role_name',
          'role_resources',
          'role_user_ref',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'roles', },
  },
  {
    method: 'DELETE',
    url: '/role/:id',
    preHandler: session.isAuthenticated,
    handler: controller.deleteRoleByID,
    config: { resource_name: 'roles', },
  },
]

const API_ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = API_ROUTER
