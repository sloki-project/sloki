# LokiJS-Server
A TCP/TLS/HTTP/HTTPS Server for [LokiJS](http://lokijs.org/) using [JSONRPC](https://www.jsonrpc.org/) ([Jayson](https://github.com/tedeh/jayson))

[![Join the chat at https://gitter.im/techfort/LokiJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/LokiJS-Server/community)
[![alt CI-badge](https://travis-ci.org/franck34/LokiJS-Server.svg?branch=master)](https://travis-ci.org/franck34/LokiJS-Server)
[![npm version](https://badge.fury.io/js/lokijs-server.svg)](http://badge.fury.io/js/lokijs-server)
[![alt packagequality](http://npm.packagequality.com/shield/lokijs-server.svg)](http://packagequality.com/#?package=lokijs-server)
[![Known Vulnerabilities](https://snyk.io/test/github/franck34/LokiJS-Server/badge.svg?targetFile=package.json)](https://snyk.io/test/github/franck34/LokiJS-Server?targetFile=package.json)

**WORK IN PROGRESS**


## Overview

[LokiJS](http://lokijs.org/) is a document oriented database written in javascript, published under MIT License.
Its purpose is to store javascript objects as documents in a nosql fashion and retrieve them with a similar mechanism.

LokiJS-Server is a transport adapter using [JSONRPC](https://www.jsonrpc.org/) protocol. It *will* support TCP/TLS/HTTP/HTTPS.

It address the **scalability** lack of our favorite LokiJS.

```
                                  JSONRPC (jayson)
                                 TCP|TLS|HTTP|HTTPS

+----------------------------+                         +----------------------------------+
|                            |                         |          LokiJS-Server           |
|       NodeJS Daemon        |<----------------------->|        (Local or Remote)         |
|                            |                         |                                  |
+----------------------------+                         |    +------------------------+    |
                                                       |    |                        |    |
+----------------------------+                         |    |                        |    |
|                            |                         |    |                        |    |
|       NodeJS Daemon        |<----------------------->|    |         LokiJS         |    |
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

* locally: ```npm install LokiJS-Server``` or ```yarn add LokiJS-Server```
* globaly: ```npm install -g LokiJS-Server``` or ```yarn add -g LokiJS-Server```


## Current state

**WORK IN PROGRESS**

**NOT USABLE YET**

See [CHANGELOG.md](/CHANGELOG.md)


* Commands implementation

| Status   | Command  | Parameter | Description                 |
|----------|----------|-----------|-----------------------------|
| [x]      | quit     |           | TCP only: client disconnect |
    - [x] quit (for TCP clients only)
    - [x] shutdown (shutdown LokiJS-Server)
    - [x] showMemory (return memory usage)
    - [x] showClients (return TCP connected clients list)
    - [x] showCommands (return available commands)
    - [x] showDatabases (return available databases)
    - [x] db (like mongodb, return current selected database)
    - [x] use databaseName (like mongodb, select a (new) database)


* Transports implementation

    - [x] TCP Client
    - [ ] TLS Client
    - [ ] HTTP Client
    - [ ] HTTPS Client


* Benchmarks

    - [ ] TCP Benchmark
    - [ ] TLS Benchmark
    - [ ] HTTP Benchmark
    - [ ] HTTPS Benchmark


* Extra Tools

    - [ ] CLI (will use TCP client)


* Improvements on top of LokiJS

    - [ ] Authentication



## Boot options

* Environnement variables

| Name   | Default Value  | Possible values | Implemented since version
|---|---|---|---|
| LOKI_DIR  | ~/.lokijs/dbs  | | 0.0.0 |
| LOKI_TRANSPORT  | TCP | TCP\|HTTP\|TCP-HTTP | 0.0.0 |

* Command line options

| Option   | Default Value  | Possible values | Implemented since version
|---|---|---|---|
| dir  | ~/.lokijs/dbs  | | 0.0.0 |
| transport  | TCP | TCP\|HTTP\|TCP-HTTP | 0.0.0 |
