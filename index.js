module.exports = require('./lib/solidbot')
module.exports.bots = {
  cmd : require('./lib/bots/cmd'),
  db  : require('./lib/bots/db')
}
