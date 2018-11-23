const bcrypt = require('bcrypt')
const path = require('path')
const APP_GLOBAL = require('../config/global.js')
const APP_CONFIG = require('../config/config')
const modelSession = require(path.join(APP_GLOBAL.appServerPath, '../models/session'))


const isAuthenticated = (req, res, next) => {
    // console.log('== req.session.user ==', req.session.user)
    if(req.session.user)
        return next()

    var err = new Error('You must be logged!')
    err.status = 401
    return next(err)
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

const userSessionDataChanged = (user, req) => {
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

const removeUserSession = (userID) => {
    return new Promise((resolve, reject) => {
        modelSession.find({'session.user.user_id': userID.toString()}).deleteOne()
        .then(session => {
            if(session.n && session.ok)
                resolve(true)
            else
                resolve(false)
        })
        .catch(err => {
            reject(false)
        })
    })
}

// NOTE: print errors


module.exports = {
    isAuthenticated: isAuthenticated,
    hashPassword: hashPassword,
    passwordIsEqual: passwordIsEqual,
    userSessionDataChanged: userSessionDataChanged,
    removeUserSession: removeUserSession,
}
