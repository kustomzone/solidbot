#!/usr/bin/env node

// requires
var debug = require('debug')('solidbot:crawl')
var commander = require('commander')
var extractors = require('extractors')
var fs = require('fs')

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

  var interval = job.data.interval || defaultInterval
  debug('interval is', interval)

  if (media) {
    extractors.downloadMedia(fetchURI, output, function (err, ret) {
      if (!err) {
        debug('success', ret)
      } else {
        debug('error', err)
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
      } else {
        debug('error', err)
      }
    })
  }
}

// called as exe
if (require.main === module) {
  var program = commander
  .option('-m --media', 'Media flag')
  .option('-O --output <file>', 'Output file')
  .parse(process.argv)

  var job = {}
  job.data = {}
  job.data.media = program.media
  job.data.output = program.output
  job.data.uri = program.args[0]
  if (program.config) {
    job.data.config = require(program.config).db
  }

  bot(job, function () {
    debug('done')
  })
}

module.exports = bot
