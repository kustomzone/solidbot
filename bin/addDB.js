#!/usr/bin/env node

var commander = require('commander')
var kue = require('kue')

// init
var queue = kue.createQueue()

var program = commander
.option('-c --config <file>', 'Config file')
.parse(process.argv)

var sql = program.args[0] || sql
var config = require(program.config).db

if (! sql || !config) {
  console.error('must supply aql and config')
  process.exit(-1)
}

// job
var job = queue.create('db', {
  'title': 'run db sql',
  'sql': sql,
  'config': config
}).save(function (err) {
  if (!err) {
    console.log(job.id)
  }
  process.exit()
})
