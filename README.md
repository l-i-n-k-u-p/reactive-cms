<div align="center">
    <img src="./ReadmeMDAssets/reactive-cms-logo.png" width="300" height="auto"/>
    <br />
    A simple CMS more to start your project!
    <br />
</div>

Technologies and Design
-
- Docker
- NodeJS
- MongoDB
- FastifyJS
- MongooseJS
- VueJS
- Vue-MC
- Vue-Router
- Tiptap
- SocketIO
- PM2
- Material Design

Requeriments
-
- Linux
- Docker
- Nginx latest (if you don't use Docker)
- NodeJS > v10.16.0 (if you don't use Docker)
- MongoDB latest (if you don't use Docker)


Initial Configuration
-
- Edit config/config.js file with your preferences
```javascript
const APP_CONFIG = {
  port: 3000,
  mongoDBURI: 'mongodb://192.168.1.8:27017/reactivecms',
  bcryptSaltRounds: 12,
  appSecret: 'iCD5e@rx$3-9rR_QZwIW2Dg-Zn^h&heS', // 32 characters
  staticUploadPath: 'site-static',
  staticUploadPrefix: 'public', // use '/public/' instead of '/site-static/'
  uploadDirectory: 'site-static/uploads/',
  staticFilesPath: 'static',
  staticFilesPrefix: 'website',
  sessionMaxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  ipAddressToListen: '0.0.0.0', // 0.0.0.0 for docker container
  domain: 'localhost', // localhost \ domain.com
  fastifyOptions: {
    http2: false,
    https: null,
    ignoreTrailingSlash: true,
    logger: false,
  },
  socketIOOptions: {
    socketIOpingTimeout: 60000,
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  emailOptions: {
    emailService: 'gmail',
    emailAccount: '',
    emailAccountPassword: '',
  },
}
```


Install and running app using Docker
-
```bash
cd reactive-cms;
sh rcms.sh -h; # you can see all commands for use app with Docker
sh rcms.sh --deployment; # this command download and create images
sh rcms.sh --start-development; # this command create docker containers and run all services
```
When you use --start-development or --start-production mode, all services are running in each container
and you can see the logs using:
```bash
docker logs <container id> -f --tail 100
```


Install and running app without Docker
-
```bash
cd reactive-cms;
npm install;
npm run start; # compile dashboard and run server in production mode
npm run server-production; # only run server in production mode
npm run server-development; # run server in development mode and watch for file changes
npm run server-monit; # show all server logs with PM2
npm run server-logs; # show all server logs
npm run server-stop; # stop all server instances
npm run dashboard-development; # compile dashboard in development mode and watch for file changes
npm run dashboard-production; # compile dashboard in production mode
```


Test
-
If you don't edit nothing about default ports from config.js

Now enter to: localhost:3000 and fill the setup form.


To do:
-
- Create global environment config for all containers
- Prepare all containers for use docker stack deploy
- Create complete documentation page


## Email:
eduardobc.88@gmail.com

<div align="center">
    <br />
    Development by:
    <br />
    linkup
</div>
