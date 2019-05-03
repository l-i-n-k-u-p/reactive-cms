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
  },
  {
    method: 'GET',
    url: '/users/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getUsersPaged,
  },
  {
    method: 'GET',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getUserByID,
  },
  {
    method: 'POST',
    url: '/user/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewUser,
  },
  {
    method: 'PUT',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateUserByID,
  },
  {
    method: 'DELETE',
    url: '/user/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deleteUserByID,
  },
  {
    method: 'GET',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getPostByID,
  },
  {
    method: 'POST',
    url: '/post/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewPost,
  },
  {
    method: 'GET',
    url: '/posts/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getPostsByPage,
  },
  {
    method: 'PUT',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updatePostByID,
  },
  {
    method: 'DELETE',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deletePostByID,
  },
  {
    method: 'GET',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getPageByID,
  },
  {
    method: 'POST',
    url: '/page/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewPage,
  },
  {
    method: 'GET',
    url: '/pages/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getPagesByPage,
  },
  {
    method: 'PUT',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updatePageByID,
  },
  {
    method: 'DELETE',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deletePageByID,
  },
  {
    method: 'GET',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getMediaByID,
  },
  {
    method: 'POST',
    url: '/media-file/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewMedia,
  },
  {
    method: 'GET',
    url: '/media-files/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getMediaByPage,
  },
  {
    method: 'PUT',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateMediaByID,
  },
  {
    method: 'DELETE',
    url: '/media-file/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deleteMediaByID,
  },
  {
    method: 'GET',
    url: '/setting/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getSettings,
  },
  {
    method: 'PUT',
    url: '/setting/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateSettings,
  },
  {
    method: 'GET',
    url: '/site/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getSiteSettings,
  },
  {
    method: 'PUT',
    url: '/site/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateSiteSettings,
  },
  {
    method: 'GET',
    url: '/dashboard/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getDashboard,
  },
  {
    method: 'GET',
    url: '/page/template-files*',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getTemplateFileNames,
  },
  {
    method: 'GET',
    url: '/role/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getRoleByID,
  },
  {
    method: 'POST',
    url: '/role/',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.addNewRole,
  },
  {
    method: 'GET',
    url: '/roles/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getRolesByPage,
  },
  {
    method: 'PUT',
    url: '/role/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.updateRoleByID,
  },
  {
    method: 'DELETE',
    url: '/role/:id',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.deleteRoleByID,
  },
  {
    method: 'GET',
    url: '/views/:page',
    preHandler: session.isAuthenticated,
    handler: dashboardAPIController.getViewNames,
  },
]

const dasboardAPIRouter = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = dasboardAPIRouter
