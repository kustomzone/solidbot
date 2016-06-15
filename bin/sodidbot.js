#!/usr/bin/env node

var CronJob = require('cron').CronJob

var kue = require('kue')

var queue = kue.createQueue()

var interval = 4

new CronJob('*/'+ interval +' * * * * *', function() {
  console.log('Running Cron every '+ interval +' seconds')

  queue.inactiveCount( function( err, total ) { // others are activeCount, completeCount, failedCount, delayedCount
  console.log(total);
});

}, null, true, 'America/Los_Angeles')

kue.app.listen(3002)

/*
var job = queue.create('test', {
    title: 'test job'
  , description: 'just a test'
  , extra: 'extra field'
}).save( function(err){
   if( !err ) console.log( job.id );
})
*/
