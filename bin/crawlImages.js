#!/usr/bin/env node

// requires
var Xray = require('x-ray')
var x = Xray()

// globals
var url = process.argv[2] || 'https://commons.wikimedia.org/wiki/Category:Art'
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
    var href = obj[i].href
    if (!href) {
      continue
    }
    if ( (/\.(gif|jpg|jpeg|tiff|png|GIF|JPG|JPEG|TIFF|PNG)$/i).test(href) ) {
      ttl += '<'+url+'> <https://schema.org/image> <' + obj[i].href + '> .\n'
    }
  }
  console.log(ttl)


})
