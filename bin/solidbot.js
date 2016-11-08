#!/usr/bin/env node

var commander = require('commander')
var CronJob = require('cron').CronJob
var kue = require('kue')
var solidbot = require('../')

var db = solidbot.bots.db
var chain = solidbot.bots.chain
var cmd = solidbot.bots.cmd
var crawl = solidbot.bots.crawl
var inbox = solidbot.bots.inbox

// init
var interval = 4
var queue = kue.createQueue()

// cron
new CronJob('*/' + interval + ' * * * * *', function () {
  console.log('Running Cron every ' + interval + ' seconds')
}, null, true, 'America/Los_Angeles')

var program = commander
  .option('-p --port [num]', 'Port Number')
  .option('-c --crawl <sites>', 'Comma separted set of sites job with crawl/site')
  .option('-q --queues <queues>', 'Comma separated set of queues to use, overrides default')
  .parse(process.argv)

var crawlSites = program.crawl
var queues = program.queues

if (crawlSites) {
  var sites = crawlSites.split(',')
  for (var i = 0; i < sites.length; i++) {
    var site = sites[i]
    queue.process('crawl' + '/' + site, crawl)
  }
}

if (queues) {
  var q = queues.split(',')

  if (q.indexOf('db') !== -1) {
    queue.process('db', db)
  }
  if (q.indexOf('chain') !== -1) {
    queue.process('chain', chain)
  }
  if (q.indexOf('cmd') !== -1) {
    queue.process('cmd', cmd)
  }
  if (q.indexOf('crawl') !== -1) {
    queue.process('crawl', crawl)
  }
  if (q.indexOf('inbox') !== -1) {
    queue.process('inbox', inbox)
  }
} else {
  queue.process('db', db)
  queue.process('chain', chain)
  queue.process('cmd', 1, cmd)
  queue.process('crawl', crawl)
  queue.process('inbox', inbox)
}

var defaultPort = 3005
var port = program.port || defaultPort

// server
kue.app.listen(port)
