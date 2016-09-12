#!/usr/bin/env node

var commander = require('commander')
var kue = require('kue')

// init
var queue = kue.createQueue()

var program = commander
.option('-O --output <file>', 'Output file')
.option('-i --interval <s>', 'Interval', parseInt)
.option('-m --media <>', 'Media')
.option('-r --redis <>', 'Redis')
.option('-s --site <>', 'Site')
.parse(process.argv)

var interval = program.interval
var media = program.media
var output = program.output
var uri = program.args[0]
var redis = program.redis
var site = program.site

if (!uri || !output) {
  console.error('must supply uri and output')
  process.exit(-1)
}

var jobName = 'crawl'
if (site) {
  jobName += '/' + site
}

// job
var job = queue.create(jobName, {
  'title': 'run crawl',
  'output': output,
  'uri': uri,
  'media': media,
  'redis': redis,
  'interval': interval
}).save(function (err) {
  if (!err) {
    console.log(jobName)
    console.log(job.id)
    console.log(job.data)
  }
  process.exit()
})
