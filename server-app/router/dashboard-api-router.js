const session = require('../lib/session')
const dashboardAPIController = require('../controller/dashboard-api-controller')


let routes = [
  {
    method: 'POST',
    url: '/login/',
    handler: dashboardAPIController.login,
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
    url: '/users/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getUsersPaged,
    config: { resource_name: 'users', },
  },
  {
    method: 'GET',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getUserByID,
    config: { resource_name: 'users', },
  },
  {
    method: 'POST',
    url: '/user/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewUser,
    config: { resource_name: 'users', },
  },
  {
    method: 'PUT',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateUserByID,
    config: { resource_name: 'users', },
  },
  {
    method: 'DELETE',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deleteUserByID,
    config: { resource_name: 'users', },
  },
  {
    method: 'GET',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getPostByID,
    config: { resource_name: 'posts', },
  },
  {
    method: 'POST',
    url: '/post/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewPost,
    config: { resource_name: 'posts', },
  },
  {
    method: 'GET',
    url: '/posts/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getPostsByPage,
    config: { resource_name: 'posts', },
  },
  {
    method: 'PUT',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updatePostByID,
    config: { resource_name: 'posts', },
  },
  {
    method: 'DELETE',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deletePostByID,
    config: { resource_name: 'posts', },
  },
  {
    method: 'GET',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getPageByID,
    config: { resource_name: 'pages', },
  },
  {
    method: 'POST',
    url: '/page/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewPage,
    config: { resource_name: 'pages', },
  },
  {
    method: 'GET',
    url: '/pages/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getPagesByPage,
    config: { resource_name: 'pages', },
  },
  {
    method: 'PUT',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updatePageByID,
    config: { resource_name: 'pages', },
  },
  {
    method: 'DELETE',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deletePageByID,
    config: { resource_name: 'pages', },
  },
  {
    method: 'GET',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getMediaByID,
    config: { resource_name: 'media', },
  },
  {
    method: 'POST',
    url: '/media-file/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewMedia,
    config: { resource_name: 'media', },
  },
  {
    method: 'GET',
    url: '/media-files/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getMediaByPage,
    config: { resource_name: 'media', },
  },
  {
    method: 'PUT',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateMediaByID,
    config: { resource_name: 'media', },
  },
  {
    method: 'DELETE',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deleteMediaByID,
    config: { resource_name: 'media', },
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
    url: '/page/template-files*',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getTemplateFileNames,
    config: { resource_name: 'pages', },
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
    url: '/views/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getViewNames,
    config: { resource_name: 'roles', },
  },
]

const dasboardAPIRouter = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = dasboardAPIRouter
