#!/usr/bin/env node

var CronJob       = require('cron').CronJob
var child_process = require('child_process')
var kue           = require('kue')
var solidbot      = require('../')

var db            = solidbot.bots.db
var cmd           = solidbot.bots.cmd


// init
var interval = 4
var queue    = kue.createQueue()


// cron
new CronJob('*/'+ interval +' * * * * *', function() {
  console.log('Running Cron every '+ interval +' seconds')


}, null, true, 'America/Los_Angeles')



queue.process('db', db)
queue.process('cmd', cmd)





// server
kue.app.listen(3002)
