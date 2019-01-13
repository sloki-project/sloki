# LokiJS-Server
A TCP/HTTP Server for [LokiJS](http://lokijs.org/)

[![Join the chat at https://gitter.im/techfort/LokiJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/LokiJS-Server/community)
[![alt CI-badge](https://travis-ci.org/franck34/LokiJS-Server.svg?branch=master)](https://travis-ci.org/franck34/LokiJS-Server)
[![npm version](https://badge.fury.io/js/lokijs-server.svg)](http://badge.fury.io/js/lokijs-server)
[![alt packagequality](http://npm.packagequality.com/shield/lokijs-server.svg)](http://packagequality.com/#?package=lokijs-server)
[![Known Vulnerabilities](https://snyk.io/test/github/franck34/LokiJS-Server/badge.svg?targetFile=package.json)](https://snyk.io/test/github/franck34/LokiJS-Server?targetFile=package.json)

**WORK IN PROGRESS**


## Overview

[LokiJS](http://lokijs.org/) is a document oriented database written in javascript, published under MIT License.
Its purpose is to store javascript objects as documents in a nosql fashion and retrieve them with a similar mechanism.
Runs in node (including cordova/phonegap and node-webkit),  [nativescript](http://www.nativescript.org) and the browser.
LokiJS is ideal for the following scenarios:

LokyJS-Server is a transport adapter using JSONRPC protocol. It *will* support TCP/TLS/HTTP/HTTPS

```
                                  JSONRPC (jayson)                                                                                
                                 TCP|TLS|HTTP|HTTPS                                                                               

+----------------------------+                         +----------------------------------+                                       
|                            |                         |          LokyJS-Server           |                                       
|       NodeJS Daemon        |<----------------------->|        (Local or Remote)         |                                       
|                            |                         |                                  |                                       
+----------------------------+                         |    +------------------------+    |                                       
                                                       |    |                        |    |                                       
+----------------------------+                         |    |                        |    |                                       
|                            |                         |    |                        |    |                                       
|       NodeJS Daemon        |<----------------------->|    |         LokyJS         |    |                                       
|                            |                         |    |       (database)       |    |                                       
+----------------------------+                         |    |                        |    |                                       
                                                       |    |                        |    |                                       
+----------------------------+                         |    +------------------------+    |                                       
|                            |                         |                                  |                                       
|           CLI              |<----------------------->|                                  |                                       
|                            |                         |                                  |                                       
+----------------------------+                         +----------------------------------+                                       
```

## Installation

Copy paste line you want)

* locally: ```npm install LokyJS-Server``` or ```yarn add LokyJS-Server```
* globaly: ```npm install -g LokyJS-Server``` or ```yarn add -g LokyJS-Server```


## Variables

* Environnement variables

| Name   | Default Value  | Possible values | Implemented since version
|---|---|---|---|
| LOKY_DIR  | ~/.lokyjs/dbs  | | 0.0.1 |
| LOKY_TRANSPORT  | TCP | TCP\|HTTP\|TCP-HTTP | 0.0.1 |

* Command line options

| Option   | Default Value  | Possible values | Implemented since version
|---|---|---|---|
| dir  | ~/.lokyjs/dbs  | | 0.0.1 |
| transport  | TCP | TCP\|HTTP\|TCP-HTTP | 0.0.1 |


## Current state

See [CHANGELOG.md](/CHANGELOG.md)


## Roadmap (TODO)
