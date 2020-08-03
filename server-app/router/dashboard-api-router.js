const session = require('../lib/session')
const dashboardAPIController = require('../controller/dashboard-api-controller')


let routes = [
  {
    method: 'POST',
    url: '/login/',
    handler: dashboardAPIController.login,
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
  {
    method: 'GET',
    url: '/dashboard/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getDashboard,
    config: { resource_name: 'dashboard', },
  },
  {
    method: 'GET',
    url: '/profile/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getProfileByID,
  },
  {
    method: 'PUT',
    url: '/profile/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateProfileByID,
    schema: {
      body: {
        type: 'object',
        properties: {
          user_email: { type: 'string' },
          user_first_name: { type: 'string' },
        },
        required: [
          'user_email',
          'user_first_name',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'GET',
    url: '/dashboard-settings/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getDashboardSettings,
  },
]

const dasboardAPIRouter = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = dasboardAPIRouter
