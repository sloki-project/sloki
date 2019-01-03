# LokiJS-Server
A TCP/HTTP Server for [LokiJS](http://lokijs.org/)

[![Join the chat at https://gitter.im/techfort/LokiJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/techfort/LokiJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![alt CI-badge](https://travis-ci.org/techfort/LokiJS-Server.svg?branch=master)
[![npm version](https://badge.fury.io/js/lokijs-server.svg)](http://badge.fury.io/js/lokijs-server)
[![alt packagequality](http://npm.packagequality.com/shield/lokijs-server.svg)](http://packagequality.com/#?package=lokijs-server)

**WORK IN PROGRESS**


## Overview

[LokiJS](http://lokijs.org/) is a document oriented database written in javascript, published under MIT License.
Its purpose is to store javascript objects as documents in a nosql fashion and retrieve them with a similar mechanism.
Runs in node (including cordova/phonegap and node-webkit),  [nativescript](http://www.nativescript.org) and the browser.
LokiJS is ideal for the following scenarios:

LokyJS-Server is a transport adapter. It should support TCP (kind of redis-cli equivalent) and/or a HTTP based JSON API.  


## Installation

Copy paste line you want)

* locally: ```npm install LokyJS-Server``` or ```yarn add LokyJS-Server```
* globaly: ```npm install -g LokyJS-Server``` or ```yarn add -g LokyJS-Server```


## Variables

* Environnement variables

| Name   | Default Value  | Possible values | Implemented since version
|---|---|---|---|
| LOKY_PATH  | ~/.lokyjs  | |
| LOKY_EXPOSE  | TCP | TCP\|HTTP\|TCP-HTTP |  |

* Command line options

| Option   | Default Value  | Possible values | Implemented since version
|---|---|---|---|
| path  | ~/.lokyjs  | |
| expose  | TCP | TCP\|HTTP\|TCP-HTTP | |


## Current state

See [CHANGELOG.md](/CHANGELOG.md)


## Roadmap (TODO)
