const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/setup',
    handler: controller.websiteSetupView,
  },
  {
    method: 'POST',
    url: '/setup',
    handler: controller.websiteSetupSetInitialConfig,
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
    handler: controller.websiteAdminValidateRequestAccess,
  },
  {
    method: 'POST',
    url: '/admin',
    handler: controller.websiteAdminValidateLoginAccess,
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
    handler: controller.websiteDashboardLogout,
  },
  {
    method: 'GET',
    url: '/dashboard*',
    handler: controller.websiteDashboardView,
  },
  {
    method: 'GET',
    url: '/recover-account',
    handler: controller.websiteRecoverAccountView,
  },
  {
    method: 'POST',
    url: '/recover-account',
    handler: controller.websiteRecoverAccount,
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
    handler: controller.websiteResetPasswordView,
  },
  {
    method: 'POST',
    url: '/reset-password/',
    handler: controller.websiteResetPassword,
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
    handler: controller.websiteIndexView,
  },
  {
    method: 'GET',
    url: '/:slug',
    handler: controller.websitePageView,
  },
  {
    method: 'GET',
    url: '/blog*',
    handler: controller.websiteBlogArchiveView,
  },
  {
    method: 'GET',
    url: '/blog/page/:page',
    handler: controller.websiteBlogArchivePaginatedView,
  },
  {
    method: 'GET',
    url: '/blog/:slug',
    handler: controller.websiteBlogSingleView,
  },
]

const ROUTER = async (fastify, opts, next) => {
  routes.forEach((route) => {
    if (route.url.indexOf('/setup') < 0 && route.method.indexOf('POST') < 0)
      route.preHandler = controller.websiteSetupPassed
    if (route.url.indexOf('/dashboard') >= 0)
      route.preHandler = session.isAuthenticated
    fastify.route(route)
  })
}

module.exports = ROUTER
