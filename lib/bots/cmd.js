#!/usr/bin/env node

// requires
var debug = require('debug')('solidbot:cmd')
var commander = require('commander')
var exec = require('child_process').exec

// init
var defaultInterval = 1000

/**
 * runs a command
 * @param  {object}   job  A kue job.
 * @param  {object}   done Called after done.
 */
function bot (job, done) {
  debug('cmd job')
  debug(job.data)
  debug('Running : ' + job.data.title)
  var cmd = job.data.cmd
  debug(cmd)
  var interval = job.data.interval || defaultInterval
  debug('interval is', interval)

  if (cmd) {
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        debug('error', err)
        setTimeout(done, interval * 0)
      } else {
        if (stdout) {
          console.log(stdout)
        }
        if (stderr) {
          // console.error(stderr)
        }
        setTimeout(done, interval * 1000)
      }
    })
  } else {
    debug('no command found')
    setTimeout(done, interval * 0)
  }
}

// called as exe
if (require.main === module) {
  var program = commander.parse(process.argv)

  var job = {}
  job.data = {}
  job.data.cmd = program.args[0]

  bot(job, function () {
    debug('done')
  })
}

module.exports = bot
