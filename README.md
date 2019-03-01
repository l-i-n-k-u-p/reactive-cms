<div align="center">
    <img src="./ReadmeMDAssets/reactive-cms-logo.png" width="300" height="auto"/>
    <br />
    A simple CMS more to start your project!
    <br />
</div>

Technologies and Design
-
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
- NodeJS
- MongoDB

Installation
-
```bash
git clone https://github.com/reactive-web/reactive-cms.git
cd reactive-cms
npm install
```

Initial Configuration
-
- Edit config/config.js file with your preferences
```javascript
const APP_CONFIG = {
  port: 3000,
  mongoDBURI: 'mongodb://172.17.0.2:27017/reactivecms',
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
  websiteTemplatesPath: 'server-app/view/template/', // change only if edit the structure website directory
}
```

Running App
-
```bash
npm run start # compile dashboard and run server in production mode
npm run server-production # only run server in production mode
npm run server-development # run server in development mode and watch for file changes
npm run server-logs # show all server logs
npm run server-stop # stop all server instances
npm run dashboard-development # compile dashboard in development mode and watch for file changes
npm run dashboard-production # compile dashboard in production mode
```

Test
-
If you don't edit nothing about default ports from config.js

Now enter to: localhost:3000 and fill the setup form.


## Email:
eduardobc.88@gmail.com

<div align="center">
    <br />
    Development by:
    <br />
    <a href="https://www.reactive-web.com">
        <img src="./ReadmeMDAssets/reactive-web.png" width="300" height="auto"/>
    </a>
</div>
