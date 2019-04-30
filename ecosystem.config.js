module.exports = {
  apps: [{
    name: 'REACTIVE-CMS',
    script: './server-app/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      'NODE_ENV': 'development',
    },
    env_production: {
      'NODE_ENV': 'production',
    },
    ignore_watch: [
      'node_modules',
      'dashboard-app',
      'site-static',
      'server-app/static',
    ],
    watch_options: {
      followSymlinks: false
    }
  }]
}
