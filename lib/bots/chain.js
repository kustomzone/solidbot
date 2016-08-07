#!/usr/bin/env node

// requires
var child_process = require('child_process')
var debug         = require('debug')('solidbot:chain')

/**
 * runs a chained command
 * @param  {object}   job  A kue job.
 * @param  {object}   done Called after done.
 */
function bot(job, done) {

  var jobs = job.data.jobs
  console.log(job.data.jobs)
  if (!jobs) {
    done()
    return
  }

  for (var i = 0; i < jobs.length; i++) {
    var j = jobs[i]
    debug('Running : ' + j)
  }
  done()

}

module.exports = bot
