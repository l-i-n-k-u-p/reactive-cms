const session = require('../../lib/session')
const websiteDashboardAPIController = require('../controller/website-dashboard-api-controller')


// NOTE: add {beforeHandler:} for auth route in each necessary route
let routes = [
    {
        method: 'GET',
        url: '/search*',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.search,
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    search: {type: 'string'},
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
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.searchMedia,
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    search: {type: 'string'},
                    mimetype: {type: 'string'},
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
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getUsersPaged,
    },
    {
        method: 'GET',
        url: '/user/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getUserByID,
    },
    {
        method: 'POST',
        url: '/user/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.addNewUser,
    },
    {
        method: 'PUT',
        url: '/user/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.updaterUserByID,
    },
    {
        method: 'DELETE',
        url: '/user/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.deleteUserByID,
    },
    {
        method: 'GET',
        url: '/post/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getPostByID,
    },
    {
        method: 'POST',
        url: '/post/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.addNewPost,
    },
    {
        method: 'GET',
        url: '/posts/:page',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getPostsByPage,
    },
    {
        method: 'PUT',
        url: '/post/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.updatePostByID,
    },
    {
        method: 'DELETE',
        url: '/post/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.deletePostByID,
    },
    {
        method: 'GET',
        url: '/page/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getPageByID,
    },
    {
        method: 'POST',
        url: '/page/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.addNewPage,
    },
    {
        method: 'GET',
        url: '/pages/:page',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getPagesByPage,
    },
    {
        method: 'PUT',
        url: '/page/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.updatePageByID,
    },
    {
        method: 'DELETE',
        url: '/page/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.deletePageByID,
    },
    {
        method: 'GET',
        url: '/media-file/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getMediaByID,
    },
    {
        method: 'POST',
        url: '/media-file/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.addNewMedia,
    },
    {
        method: 'GET',
        url: '/media-files/:page',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getMediaByPage,
    },
    {
        method: 'PUT',
        url: '/media-file/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.updateMediaByID,
    },
    {
        method: 'DELETE',
        url: '/media-file/:id',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.deleteMediaByID,
    },
    {
        method: 'GET',
        url: '/setting/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getSettings,
    },
    {
        method: 'PUT',
        url: '/setting/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.updateSettings,
    },
    {
        method: 'GET',
        url: '/site/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getSiteSettings,
    },
    {
        method: 'PUT',
        url: '/site/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.updateSiteSettings,

    },
    {
        method: 'GET',
        url: '/dashboard/',
        beforeHandler: session.isAuthenticated,
        handler: websiteDashboardAPIController.getDashboard,
    },
]

let websiteDasboardAPIRouter = async (fastify, opts, next) => {
    routes.forEach((route) => {
        fastify.route(route)
    })
}


module.exports = websiteDasboardAPIRouter
