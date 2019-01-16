const APP_CONFIG = require('../config/config')


const slugException = (req, res, next) => {
    let slug = req.params.slug
    if(APP_CONFIG.ignorePageSlug.indexOf(slug) >= 0)
        return req.next()

    next()
}


module.exports = {
    slugException: slugException,
}
