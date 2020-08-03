const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: controller.getDocument,
    config: { resource_name: 'posts', },
  },
  {
    method: 'POST',
    url: '/post/',
    preHandler: session.isAuthenticated,
    handler: controller.postDocument,
    schema: {
      body: {
        type: 'object',
        properties: {
          post_title: { type: 'string' },
          post_content: { type: 'string' },
        },
        required: [
          'post_title',
          'post_content',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'posts', },
  },
  {
    method: 'GET',
    url: '/posts/:page',
    preHandler: session.isAuthenticated,
    handler: controller.getDocumentsPaged,
    config: { resource_name: 'posts', },
  },
  {
    method: 'PUT',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: controller.putDocument,
    schema: {
      body: {
        type: 'object',
        properties: {
          post_title: { type: 'string' },
          post_content: { type: 'string' },
        },
        required: [
          'post_title',
          'post_content',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'posts', },
  },
  {
    method: 'DELETE',
    url: '/post/:id',
    preHandler: session.isAuthenticated,
    handler: controller.deleteDocument,
    config: { resource_name: 'posts', },
  },
]

const dasboardAPIRouter = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = dasboardAPIRouter
