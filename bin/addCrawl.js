#!/usr/bin/env node

var commander = require('commander')
var kue = require('kue')

// init
var queue = kue.createQueue()

var program = commander
.option('-O --output <file>', 'Output file')
.option('-i --interval <s>', 'Interval', parseInt)
.option('-m --media <>', 'Media')
.parse(process.argv)

var interval = program.interval
var media = program.media
var output = program.output
var uri = program.args[0]

if (!uri || !output) {
  console.error('must supply uri and output')
  process.exit(-1)
}

// job
var job = queue.create('crawl', {
  'title': 'run crawl',
  'output': output,
  'uri': uri,
  'media': media,
  'interval': interval
}).save(function (err) {
  if (!err) {
    console.log(job.id)
  }
  process.exit()
})
