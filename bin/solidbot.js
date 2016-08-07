#!/usr/bin/env node

var commander     = require('commander')
var CronJob       = require('cron').CronJob
var child_process = require('child_process')
var kue           = require('kue')
var solidbot      = require('../')

var db            = solidbot.bots.db
var chain         = solidbot.bots.chain
var cmd           = solidbot.bots.cmd
var inbox         = solidbot.bots.inbox

// init
var interval = 4
var queue    = kue.createQueue()

// cron
new CronJob('*/'+ interval +' * * * * *', function() {
  console.log('Running Cron every '+ interval +' seconds')

}, null, true, 'America/Los_Angeles')

queue.process('db', db)
queue.process('chain', chain)
queue.process('cmd', cmd)
queue.process('inbox', inbox)

commander
.option('-p --port [num]', 'Port Number')
.parse(process.argv)

var defaultPort = 3005
var port = commander.port || defaultPort

// server
kue.app.listen(port)
