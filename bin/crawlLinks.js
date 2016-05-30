#!/usr/bin/env node

// requires
var Xray = require('x-ray')
var x = Xray()

// globals
var url = 'https://commons.wikimedia.org/wiki/Category:Art'
var pattern = 'a'
var next = '.next@href'

// main
x(url, 'a', [{
  href: '@href'
}])
.paginate(next)
.limit(1)(function(err, obj) {
  var ttl = ''
  for (var i = 0; i < obj.length; i++) {
    ttl += '<'+url+'> <https://schema.org/significantLink> <' + obj[i].href + '> .\n'
  }
  console.log(ttl)


})
