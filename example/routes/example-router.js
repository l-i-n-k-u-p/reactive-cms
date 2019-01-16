const express = require('express')
const APP_GLOBAL = require('../../config/global')
const SITE_CONFIG = require('../../config/site-config')
const router = express.Router()

const modelItem = require('../../models/item')


router.get('/', (req, res) => {
    res.render('example-index', {
        title: SITE_CONFIG.siteTitle,
    })
})

router.get('/create', (req, res) => {
    res.render('example-index', {
        title: SITE_CONFIG.siteTitle,
    })
})

router.get('/edit/:id', (req, res) => {
    res.render('example-index', {
        title: SITE_CONFIG.siteTitle,
    })
})


module.exports = router
