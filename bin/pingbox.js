#!/usr/bin/env node

var CronJob       = require('cron').CronJob
var child_process = require('child_process')
var kue           = require('kue')

// init
var queue    = kue.createQueue()

var uri      = process.argv[2] || 'https://melvincarvalho.com/#me'
var cert     = process.argv[3]

// job
var job = queue.create('inbox', {
  "title": 'check inbox',
  "uri": uri,
  "cert": cert
}).priority('high').save( function(err){
  if( !err ) {
    console.log( job.id )
  }
  process.exit()
})
