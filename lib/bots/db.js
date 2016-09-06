#!/usr/bin/env node

// requires
var debug = require('debug')('solidbot:db')
var commander = require('commander')
var wcDB = require('wc_db')

// init
var defaultInterval = 0.1

/**
 * runs a command
 * @param  {object}   job  A kue job.
 * @param  {object}   done Called after done.
 */
function bot (job, done) {
  debug('db job')
  debug(job.data)
  debug('Running : ' + job.data.title)
  var sql = job.data.sql
  debug(sql)
  var interval = job.data.interval || defaultInterval
  debug('interval is', interval)
  var config = job.data.config
  debug('config', config)

  if (!sql || !config) {
    console.error('sql and config required')
    done()
    return
  }

  wcDB.runSQL(sql, config, null).then(function (ret) {
    debug(ret.ret)
    ret.conn.close()
    setTimeout(done, interval * 1000)
  }).catch(function (err) {
    debug(err)
    setTimeout(done, interval * 1000)
  })
}

// called as exe
if (require.main === module) {
  var program = commander
  .option('-c --config <file>', 'Config file')
  .parse(process.argv)

  var job = {}
  job.data = {}
  job.data.sql = program.args[0]
  if (program.config) {
    job.data.config = require(program.config).db
  }

  bot(job, function () {
    debug('done')
  })
}

module.exports = bot
