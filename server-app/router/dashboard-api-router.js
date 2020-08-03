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
    url: '/search*',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.search,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' },
        },
        required: [
          'search',
        ],
      },
    },
    config: { resource_name: 'search', },
  },
  {
    method: 'GET',
    url: '/search-media*',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.searchMedia,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          mimetype: { type: 'string' },
        },
        required: [
          'search',
          'mimetype',
        ],
      },
    },
    config: { resource_name: 'search-media', },
  },
  {
    method: 'GET',
    url: '/setting/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getSettings,
    config: { resource_name: 'settings', },
  },
  {
    method: 'PUT',
    url: '/setting/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateSettings,
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
    url: '/site/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getSiteSettings,
    config: { resource_name: 'settings', },
  },
  {
    method: 'PUT',
    url: '/site/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateSiteSettings,
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
  {
    method: 'GET',
    url: '/dashboard/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getDashboard,
    config: { resource_name: 'dashboard', },
  },
  {
    method: 'GET',
    url: '/role/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getRoleByID,
    config: { resource_name: 'roles', },
  },
  {
    method: 'POST',
    url: '/role/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewRole,
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
    handler: dashboardAPIController.getRolesByPage,
    config: { resource_name: 'roles', },
  },
  {
    method: 'PUT',
    url: '/role/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateRoleByID,
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
    handler: dashboardAPIController.deleteRoleByID,
    config: { resource_name: 'roles', },
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
