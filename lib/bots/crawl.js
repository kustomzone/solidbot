#!/usr/bin/env node

// requires
var debug = require('debug')('solidbot:crawl')
var client = require('redis').createClient()
var commander = require('commander')
var extractors = require('extractors')
var fs = require('fs')
var url = require('url')

// init
var defaultInterval = 3

/**
 * runs a command
 * @param  {object}   job  A kue job.
 * @param  {object}   done Called after done.
 */
function bot (job, done) {
  debug('crawl job')
  debug(job.data)
  debug('Running : ' + job.data.title)
  var fetchURI = job.data.uri
  var media = job.data.media
  var output = job.data.output
  var redis = job.data.redis

  var interval = job.data.interval || defaultInterval
  debug('interval is', interval)

  run(media, fetchURI, output, done, client, redis, interval)
}

function finish (done, client, redis, fetchURI, interval) {
  debug('finish')
  var hostname = url.parse(fetchURI).hostname
  debug('hostname', hostname)
  if (redis) {
    debug('redis', redis)
    var key = hostname
    var val = Date.now()
    client.get(key, function (err, reply) {
      debug(key, 'is set to', reply.toString())
      var lapse = Date.now() - parseInt(reply)
      interval = ( interval * 1000 ) - lapse
      if (interval < 0) {
        interval = 0
      }
      debug('lapse', lapse)
      setTimeout(done, interval)
    })
    client.set(key, '' + val)
  } else {
    setTimeout(done, interval*1000)
  }
}

function run (media, fetchURI, output, done, client, redis, interval) {
  if (media) {
    extractors.downloadMedia(fetchURI, output, function (err, ret) {
      if (!err) {
        debug('success', ret)
        finish(done, client, redis, fetchURI, interval)
      } else {
        debug('error', err)
        finish(done, client, redis, fetchURI, interval)
      }
    })
  } else {
    extractors.downloadDocument(fetchURI, function (err, ret) {
      if (!err) {
        debug('success')
        if (output) {
          fs.writeFileSync(output, ret)
        } else {
          console.log(ret)
        }
        finish(done, client, redis, fetchURI, interval)
      } else {
        debug('error', err)
        finish(done, client, redis, fetchURI, interval)
      }
    })
  }
}

// called as exe
if (require.main === module) {
  var program = commander
    .option('-m --media', 'Media flag')
    .option('-O --output <file>', 'Output file')
    .option('-i --interval <num>', 'Interval', parseInt)
    .option('-r --redis', 'Use Redis')
    .parse(process.argv)

  var job = {}
  job.data = {}
  job.data.media = program.media
  job.data.redis = program.redis
  job.data.output = program.output
  job.data.interval = program.interval
  job.data.uri = program.args[0]
  if (program.config) {
    job.data.config = require(program.config).db
  }

  bot(job, function () {
    debug('done')
  })
}

module.exports = bot
