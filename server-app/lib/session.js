const bcrypt = require('bcrypt')
const dateTime = require('node-datetime')

const APP_CONFIG = require('../config/config')
const DASHBOARD_ADMIN_CONFIG = require('../config/dashboard-admin-config')
const SessionModel = require('../module/session/model')


const isAuthenticated = (req, res, next) => {
  if (req.session.user === undefined) {
    const urlData = req.urlData()
    if (urlData.path.indexOf('/dashboard/api/') >= 0) {
      res.send({
        status_code: 3,
        status_msg: 'Session Finished',
      })
      return
    }
    req.session.lastPath = urlData.path
    res.view('dashboard-login', {
      title: DASHBOARD_ADMIN_CONFIG.dashboardTitle,
      error_message: '',
      csrfToken: req.csrfToken(),
    })
    return
  }
  if (req.session.lastPath) {
    let redirectURL = req.session.lastPath
    req.session.lastPath = ''
    res.redirect(redirectURL)
    return
  }
  next()
}

const saveSessionOnDB = (sessionID, user) => {
  let session = new SessionModel()
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
        reject(err)
      })
  })
}

const currentUserSessionDataChanged = (user, req) => {
  return new Promise((resolve, reject) => {
    let removeSession = false
    // NOTE: improve this with session collection
    if (user._id.toString() !== req.session.user.user_id.toString())
      resolve(false)
    else if (user.user_role_ref.toString() !== req.session.user.user_role_ref.toString())
      removeSession = true
    else if (user.user_name.toString() !== req.session.user.user_name.toString())
      removeSession = true
    else if (user.user_pass.toString() !== req.session.user.user_pass.toString())
      removeSession = true
    if (removeSession) {
      req.sessionStore.destroy(req.session.sessionId)
      resolve(true)
    }
    resolve(false)
  })
}

const removeUserSessionOnDB = async (userID) => {
  try {
    let session = await SessionModel.find({ 'session.user.user_id': userID.toString() }).deleteOne()
    if (session.n && session.ok)
      return true

    return false
  } catch (err) {
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
