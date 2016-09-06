module.exports = require('./lib/solidbot')
module.exports.bots = {
  chain: require('./lib/bots/chain'),
  cmd: require('./lib/bots/cmd'),
  crawl: require('./lib/bots/crawl'),
  db: require('./lib/bots/db'),
  inbox: require('./lib/bots/inbox')
}
