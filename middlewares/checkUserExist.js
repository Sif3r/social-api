const User = require('../models/User')

module.exports = async function (req, res, next) {
  const user = await User.find(parseInt(req.params.id));

  if (!user)
    res.status(404).json('This user does not exist')
  else {
    req.session.user = user
    next()
  }
}
