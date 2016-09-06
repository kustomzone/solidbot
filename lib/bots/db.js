#!/usr/bin/env node

// requires
var debug = require('debug')('solidbot:db')
var wcDB = require('wc_db')

// init
var defaultInterval = 0.1

/**
 * runs a command
 * @param  {object}   job  A kue job.
 * @param  {object}   done Called after done.
 */
function bot (job, done) {
  console.log('db job')
  console.log(job.data)
  console.log('Running : ' + job.data.title)
  var sql = job.data.sql
  console.log(sql)
  var interval = job.data.interval || defaultInterval
  console.log('interval is', interval)
  var config = job.data.config

  if (!sql || !config) {
    console.error('sql and config required')
    done()
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

module.exports = bot
