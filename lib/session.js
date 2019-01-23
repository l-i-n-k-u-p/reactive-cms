const bcrypt = require('bcrypt')
const path = require('path')
const dateTime = require('node-datetime')

const APP_GLOBAL = require('../config/global')
const APP_CONFIG = require('../config/config')
const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config')
const modelSession = require('../website/model/session')


const isAuthenticated = (req, res, next) => {
    if(req.session.user === undefined) {
        const urlData = req.urlData()
        if(urlData.path.indexOf('/dashboard/api/') >= 0) {
            res.send({
                status_code: 3,
                status_msg: 'Session Finished',
            })
            return
        }
        req.session.dashboardLastURL = urlData.path
        res.view('dashboard-website-login', {
            title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
            error_message: '',
        })
        return
    }
    if(req.session.dashboardLastURL) {
        res.redirect(req.session.dashboardLastURL)
        req.session.dashboardLastURL = null
        return
    }
    next()
}

const saveSessionOnDB = (sessionID, user) => {
    let session = new modelSession()
    session._id = sessionID
    session.createdAt = dateTime.create().now()
    session.session_user = user
    session.save()
}

const hashPassword = (userPass) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(userPass, APP_CONFIG.bcryptSaltRounds)
        .then((hashedPassword) => {
            resolve(hashedPassword)
        })
        .catch(err => {
            reject(err)
        })
    })
}

const passwordIsEqual = (userPass, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(userPass, hashedPassword)
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(false)
        })
    })
}

const currentUserSessionDataChanged = (user, req) => {
    return new Promise((resolve, reject) => {
        if(user._id.toString() !== req.session.user.user_id.toString())
            resolve(false)
        else if(user.user_name !== req.body.user_name || user.user_pass !== req.session.user.user_pass) {
            modelSession.find({'session.user.user_id': req.session.user.user_id}).deleteOne()
            .then(session => {
                if(session.n && session.ok)
                    resolve(true)
                else
                    resolve(false)
            })
            .catch(err => {
                reject(false)
            })
        } else
            resolve(false)
    })
}

const removeUserSessionOnDB = async (userID) => {
    try {
        let session = await modelSession.find({'session_user.user_id': userID.toString()}).deleteOne()
        if(session.n && session.ok)
            return true

        return false
    } catch(err) {
        return false
    }
}


module.exports = {
    isAuthenticated: isAuthenticated,
    hashPassword: hashPassword,
    passwordIsEqual: passwordIsEqual,
    currentUserSessionDataChanged: currentUserSessionDataChanged,
    removeUserSessionOnDB: removeUserSessionOnDB,
    saveSessionOnDB: saveSessionOnDB,
}
