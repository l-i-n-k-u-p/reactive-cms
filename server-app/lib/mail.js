const nodemailer = require('nodemailer')

const APP_CONFIG = require('../config/config')


const transporter = nodemailer.createTransport({
  service: APP_CONFIG.emailOptions.emailService,
  auth: {
    user: APP_CONFIG.emailOptions.emailAccount,
    pass: APP_CONFIG.emailOptions.emailAccountPassword,
  }
})

exports.sendEmail = async (data) => {
  transporter.sendMail({
    from: APP_CONFIG.emailOptions.emailAccount,
    to: data.to,
    subject: data.subject,
    html: data.html,
  }, (err, info) => {
    if (err)
      return {
        error: err
      }
  })
}
