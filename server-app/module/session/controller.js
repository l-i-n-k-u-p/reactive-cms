const session = require('../../lib/session')

const userQuery = require('../user/query')


exports.login = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.send({
      error_message: fisrtMessage.message,
    })
    return
  }
  const userName = req.body.user_name
  const userPass = req.body.user_pass
  let user = await userQuery.getByUserName(userName)
  if (user.error) {
    res.send({
      error_message: user.error.toString(),
    })
    return
  }
  if (!user) {
    res.send({
      error_message: 'Not valid user',
    })
    return
  }
  let result = await session.passwordIsEqual(userPass, user.user_pass)
  if (!result) {
    res.send({
      error_message: 'Not valid user',
    })
    return
  }
  req.session.user = {
    user_id: user._id.toString(),
    user_name: user.user_name,
    user_email: user.user_email,
    user_pass: user.user_pass,
    user_role_ref: user.user_role_ref,
    user_role: user.user_role,
    user_resource: user.user_resource,
  }
  res.send({
    user_id: user._id.toString(),
  })
}
