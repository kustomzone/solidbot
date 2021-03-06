#!/usr/bin/env node

module.exports = {
  crawlAlbums: crawlAlbums,
  crawlImages: crawlImages,
  crawlLinks: crawlLinks
}

// requires
var Xray = require('x-ray')
var x = Xray()

function crawlImages (url, callback) {
  // globals
  url = url || 'https://commons.wikimedia.org/wiki/Category:Art'
  var next = '.next@href'
  var ret = []

  // main
  x(url, 'a', [{
    href: '@href'
  }]).paginate(next)
    .limit(1)(function (err, obj) {
      if (!err) {
        for (var i = 0; i < obj.length; i++) {
          var href = obj[i].href
          if (!href) {
            continue
          }
          if ((/\.(gif|jpg|jpeg|tiff|png|GIF|JPG|JPEG|TIFF|PNG)$/i).test(href)) {
            ret.push(href)
          }
        }
        callback(null, ret)
      } else {
        callback(err)
      }
    })
}

function crawlLinks (url, callback) {
  // globals
  url = url || 'https://commons.wikimedia.org/wiki/Category:Art'
  var next = '.next@href'
  var ret = []

  // main
  x(url, 'a', [{
    href: '@href'
  }])
    .paginate(next)
    .limit(1)(function (err, obj) {
      if (!err) {
        for (var i = 0; i < obj.length; i++) {
          var href = obj[i].href
          if (!href) {
            continue
          }
          ret.push(href)
        }
        callback(null, ret)
      } else {
        callback(err)
      }
    })
}

function sniffAlbum (str) {
  var ret = false

  if (str.indexOf('album') !== -1) return true
  if (str.indexOf('gallery') !== -1) return true

  return ret
}

function crawlAlbums (url, callback) {
  // globals
  url = url || 'https://commons.wikimedia.org/wiki/Category:Art'
  var next = '.next@href'
  var ret = []

  // main
  x(url, 'a', [{
    href: '@href'
  }])
    .paginate(next)
    .limit(1)(function (err, obj) {
      if (!err) {
        for (var i = 0; i < obj.length; i++) {
          var href = obj[i].href
          if (!href) {
            continue
          }
          if (sniffAlbum(href)) {
            var defrag = href.split('#')[0]
            ret.push(defrag)
          }
        }
        callback(null, ret)
      } else {
        callback(err)
      }
    })
}
