const session = require('../../lib/session')
const controller = require('./controller')


let routes = [
  {
    method: 'GET',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: controller.getDocument,
    config: { resource_name: 'pages', },
  },
  {
    method: 'POST',
    url: '/page/',
    preHandler: session.isAuthenticated,
    handler: controller.postDocument,
    schema: {
      body: {
        type: 'object',
        properties: {
          page_title: { type: 'string' },
          page_content: { type: 'string' },
        },
        required: [
          'page_title',
          'page_content',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'pages', },
  },
  {
    method: 'GET',
    url: '/pages/:page',
    preHandler: session.isAuthenticated,
    handler: controller.getDocumentsPaged,
    config: { resource_name: 'pages', },
  },
  {
    method: 'PUT',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: controller.putDocument,
    schema: {
      body: {
        type: 'object',
        properties: {
          page_title: { type: 'string' },
          page_content: { type: 'string' },
        },
        required: [
          'page_title',
          'page_content',
        ],
      },
    },
    attachValidation: true,
    config: { resource_name: 'pages', },
  },
  {
    method: 'DELETE',
    url: '/page/:id',
    preHandler: session.isAuthenticated,
    handler: controller.deleteDocument,
    config: { resource_name: 'pages', },
  },
  {
    method: 'GET',
    url: '/page/template-files*',
    preHandler: session.isAuthenticated,
    handler: controller.getTemplateFileNames,
    config: { resource_name: 'pages', },
  },
]

const dasboardAPIRouter = async (fastify, opts, next) => {
  routes.forEach((route) => {
    fastify.route(route)
  })
}

module.exports = dasboardAPIRouter
