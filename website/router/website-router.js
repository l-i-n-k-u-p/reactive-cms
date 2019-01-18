const session = require('../../lib/session')
const websiteController = require('../controller/website-controller')


// NOTE: add {beforeHandler:} for auth route in each necessary route
let routes = [
    {
        method: 'GET',
        url: '/setup',
        handler: websiteController.websiteSetupView,
    },
    {
        method: 'POST',
        url: '/setup',
        handler: websiteController.websiteSetupSetInitialConfig,
        schema: {
            body: {
                type: 'object',
                properties: {
                    setup_site_name: { type: 'string' },
                    setup_site_url: { type: 'string' },
                    setup_first_name: { type: 'string' },
                    setup_user_email: { type: 'string' },
                    setup_user_name: { type: 'string' },
                    setup_user_pass: { type: 'string' },
                },
                required: [
                    'setup_site_name',
                    'setup_site_url',
                    'setup_first_name',
                    'setup_user_email',
                    'setup_user_name',
                    'setup_user_pass',
                ],
            },
        },
    },
    {
        method: 'GET',
        url: '/admin',
        handler: websiteController.websiteAdminValidateRequestAccess,
    },
    {
        method: 'POST',
        url: '/admin',
        handler: websiteController.websiteAdminValidateLoginAccess,
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
    },
    {
        method: 'GET',
        url: '/admin-logout',
        handler: websiteController.websiteAdminLogout,
    },
    {
        method: 'GET',
        url: '/dashboard*',
        beforeHandler: session.isAuthenticated,
        handler: websiteController.websiteDashboardView,
    },
    {
        method: 'GET',
        url: '/',
        handler: websiteController.websiteIndexView,
    },
    {
        method: 'GET',
        url: '/:slug',
        handler: websiteController.websitePageView,
    },
    {
        method: 'GET',
        url: '/blog*',
        handler: websiteController.websiteBlogArchiveView,
    },
    {
        method: 'GET',
        url: '/blog/page/:page',
        handler: websiteController.websiteBlogArchivePaginatedView,
    },
    {
        method: 'GET',
        url: '/blog/:slug',
        handler: websiteController.websiteBlogSingleView,
    },
]

let websiteRouter = async (fastify, opts, next) => {
    routes.forEach((route) => {
        fastify.route(route)
    })
}

module.exports = websiteRouter
