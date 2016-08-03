[![Stories in Ready](https://badge.waffle.io/solid-live/solidbot.png?label=ready&title=Ready)](https://waffle.io/solid-live/solidbot)
[![Join the chat at https://gitter.im/solid-live/solidbot](https://badges.gitter.im/solid-live/solidbot.svg)](https://gitter.im/solid-live/solidbot?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# solidbot

solidbot is a framework for running different kind of robots as a background daemon

This is a very early working prototype and *work in progress*

# Features

* It is extensible in a similar way to express handlers
* It is modular so that many different robots can run in one framework
* It is highly robust working on the [kue](https://github.com/Automattic/kue) framework, to prioritize jobs
* It is highly scalable using a [redis](http://redis.io/) database backend
* It has a [UI front end](https://github.com/Automattic/kue#user-interface) to monitor jobs
* It has APIs, via command line, javascript and [HTTP REST](https://github.com/Automattic/kue#json-api)

# Installation

Prerequisite it to install redis database and run that service

    npm install solidbot

In the bin directory there is an executable

    bin/solidbot.js

# Adding a job

There are a number of ways to add a job based on the API of the kue framework

# Default bots

A few default bots are included in the package that will be described below

# Cmd

Is of type "cmd" will run arbitrary commands in a queue.

* data.cmd = the command to rune

# Crawler

Is of type "crawler" and will crawl given URIs and optionally convert them to linked data

Currently this is implemented as a cmd type module above, but will evolve to pure JS

# Inbox

Inbox processing is a job of type "inbox" and follows the [W3C LDN Consumer Specification](https://linkedresearch.org/ldn/#consuming).

An inbox processor can be started using the command

    bin/inbox.js

A convenience method is included to ping an inbox (pinbbox)

    bin/pingbox.js <uri> [cert]

* data.uri = the uri of the inbox
* data.cert = optionally a certificate to use for authentication

The consumer will go the the inbox and display all the items in that inbox.

Further work will be to process inbox items according to their content.

# Extending solidbot

Bot extensions are stored in the

    lib/bots

Directory.  

A bot takes two parameter, a `job` which is a kue job, and a function `done` which is called when the job is completed.  It is possible to throttle jobs by delaying when done() is called.

New bots are then added to the daemon with the simple line:


```javascript
    queue.process('crawler', crawler.bots.crawler)
```

Where `crawler` here is the name of the job type.
