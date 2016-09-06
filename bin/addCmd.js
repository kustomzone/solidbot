#!/usr/bin/env node

var kue = require('kue')

// init
var queue = kue.createQueue()

var cmd = process.argv[2] || 'ls'

// job
var job = queue.create('cmd', {
  'title': 'run child process',
  'cmd': cmd,
  'extra': 'extra field'
}).save(function (err) {
  if (!err) {
    console.log(job.id)
  }
  process.exit()
})
