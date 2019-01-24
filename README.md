<div align="center">
    <img src="/ReadmeMDAssets/reactive-cms-logo.png" width="300" height="auto"/>
</div>


A simple CMS more to start your project!

Technologies and Design
-
- NodeJS
- MongoDB
- FastifyJS
- MongooseJS
- VueJS
- Vue-MC
- Vue-Router
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
    uploadDirectory: 'site-static/uploads/',
    sessionMaxAge: 10800000, // milliseconds
}
```

Running App
-
```bash
npm run pm2:start-watch # 'development mode for compile NodeJS app'
npm run webpack:website-watch # 'development mode for compile Vue app'
npm run pm2:global-logs # 'development mode check NodeJS app logs'
```
For more check package.json file

Test
-
If you don't edit nothing about default ports from config.js

Now enter to: localhost:3000 and fill the setup form.

App running...
-

Setup page:

<img width="400px" src="/ReadmeMDAssets/setup.png">


Login page:

<img width="400px" src="/ReadmeMDAssets/login.png">


Dashboard screens:

| | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
|<img width="200px" src="/ReadmeMDAssets/dashboard.png">|<img width="200px" src="/ReadmeMDAssets/pages.png">|<img width="200px" src="/ReadmeMDAssets/posts.png">|
|<img width="200px" src="/ReadmeMDAssets/media.png">|<img width="200px" src="/ReadmeMDAssets/users.png">|<img width="200px" src="/ReadmeMDAssets/settings.png">|
|<img width="200px" src="/ReadmeMDAssets/new-post.png">|<img width="200px" src="/ReadmeMDAssets/modal-media.png">|


## Email:
eduardobc.88@gmail.com

## Development by:
<div align="center">
    <a href="https://www.reactive-web.com">
        <img src="/ReadmeMDAssets/reactive-web.png" width="300" height="auto"/>
    </a>
</div>
