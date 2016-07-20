#!/usr/bin/env node

var CronJob       = require('cron').CronJob
var child_process = require('child_process')
var kue           = require('kue')
var solidbot      = require('../')

var cmd           = solidbot.bots.cmd


// init
var interval = 4
var queue    = kue.createQueue()


// cron
new CronJob('*/'+ interval +' * * * * *', function() {
  console.log('Running Cron every '+ interval +' seconds')


}, null, true, 'America/Los_Angeles')


queue.process('cmd', cmd)


queue.process('db', function(job, done){
  console.log(job.data)
  console.log('running : ' + job.data.title)
  var cmd = job.data.cmd
  console.log(cmd);
  child_process.exec(cmd, function(err, stdout, stderr){
    if (err) {
      console.error(err);
      done()
    } else {
      console.log(stdout);
      console.error(stderr);
      done()
    }
  })
})


queue.activeCount( function( err, total ) { // others are activeCount, completeCount, failedCount, delayedCount
  console.log(total)
  if (total === 0) {
    setTimeout(nextJob, interval*1000)
  }
})


// server
kue.app.listen(3002)


// process
function nextJob() {
}
