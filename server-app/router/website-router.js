const session = require('../lib/session')
const websiteController = require('../controller/website-controller')


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
    attachValidation: true,
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
    attachValidation: true,
  },
  {
    method: 'GET',
    url: '/admin-logout',
    handler: websiteController.websiteDashboardLogout,
  },
  {
    method: 'GET',
    url: '/dashboard*',
    handler: websiteController.websiteDashboardView,
  },
  {
    method: 'GET',
    url: '/recover-account',
    handler: websiteController.websiteRecoverAccountView,
  },
  {
    method: 'POST',
    url: '/recover-account',
    handler: websiteController.websiteRecoverAccount,
    schema: {
      body: {
        type: 'object',
        properties: {
          email_address: { type: 'string' },
        },
        required: [
          'email_address',
        ],
      },
    },
    attachValidation: true,
  },
  {
    method: 'GET',
    url: '/reset-password/:token',
    handler: websiteController.websiteResetPasswordView,
  },
  {
    method: 'POST',
    url: '/reset-password/',
    handler: websiteController.websiteResetPassword,
    schema: {
      body: {
        type: 'object',
        properties: {
          new_password: { type: 'string' },
        },
        required: [
          'new_password',
        ],
      },
    },
    attachValidation: true,
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

const websiteRouter = async (fastify, opts, next) => {
  routes.forEach((route) => {
    if (route.url.indexOf('/setup') < 0 && route.method.indexOf('POST') < 0)
      route.preHandler = websiteController.websiteSetupPassed
    if (route.url.indexOf('/dashboard') >= 0)
      route.preHandler = session.isAuthenticated
    fastify.route(route)
  })
}

module.exports = websiteRouter
