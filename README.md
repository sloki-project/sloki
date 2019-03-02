# Sloki
A NodeJS Server for [LokiJS](http://lokijs.org/)

#### :hammer: :hammer: :hammer: :hammer: :hammer: WORK IN PROGRESS :hammer: :hammer: :hammer: :hammer: :hammer:

[![alt CI-badge](https://travis-ci.org/sloki-project/sloki.svg?branch=master)](https://travis-ci.org/sloki-project/sloki)
[![npm version](https://badge.fury.io/js/sloki.svg?v=0)](http://badge.fury.io/js/sloki)
[![Known Vulnerabilities](https://snyk.io/test/github/sloki-project/sloki/badge.svg)](https://snyk.io/test/github/sloki-project/sloki)
[![Dependencies](https://david-dm.org/sloki-project/sloki.svg)](https://david-dm.org/sloki-project/sloki)
[![Dev Dependencies](https://david-dm.org/sloki-project/sloki/dev-status.svg)](https://david-dm.org/sloki-project/sloki?type=dev)

-----
## Documentation
1. [Introduction](#introduction)
    1. [Transports](#transports)
    2. [Protocols](#protocols)
        1. [Binary](#binary) (default)
        2. [JSONRPC](#jsonrpc)
        3. [Dinary](#dinary) (default)
2. [Server](#server)
    1. [Installation](#installation)
    2. [Run](#run)
    3. [Help](#help)
3. [Clients](#clients)
    1. [NodeJS](#nodejs)
4. [Benchmarks](#benchmarks)
5. [Development Status](#development-status)
-----

## Introduction

Sloki is a nodejs server which embed [LokiJS](http://lokijs.org/), a blazing fast in-memory documents database.
Sloki help to make LokiJS ***scalable*** : you can now have multiple processes speaking with LokiJS through Sloki.

A possible architecture using sloki :
```                  

    +----------------------------+    TCP / Binary     +-----------------------------------+
    |   NodeJS app worker #1     |<------------------->|                                   |
    +----------------------------+                     |               Sloki               |
                                                       |                                   |
    +----------------------------+    TCP / Dinary     |    +-------------------------+    |
    |  NodeJS app worker #2      |<------------------->|    |                         |    |
    +----------------------------+                     |    |                         |    |
                                                       |    |         LokiJS          |    |
    +----------------------------+    TCP / JSONRPC    |    | fast in-memory database |    |
    | go/php/python/C/whatever   |<------------------->|    |                         |    |
    +----------------------------+                     |    |                         |    |
                                                       |    |                         |    |
    +----------------------------+    TCP / Binary     |    +-------------------------+    |
    |        sloki-cli           |<------------------->|                                   |
    +----------------------------+                     +-----------------------------------+

```

## Transports

For moment, only TCP transport is implemented. The advantage of TCP vs HTTP API is that the connection is persistent (i.e more fast).
Websockets should be implemented before HTTP API.

By default, Sloki listens on the following ports:

| Port      | Transport  | TLS  | Protocol              
|:---------:|------------|------|-----------------
| 6370      | TCP        | NO   | Binary           
| 6371      | TCP        | YES  | Binary
| 6372      | TCP        | NO   | JSONRPC          
| 6373      | TCP        | YES  | JSONRPC
| 6374      | TCP        | NO   | Dinary
| 6375      | TCP        | YES  | Dinary (fastest)

If somebody have an idea why TLS over TCP is fastest than raw TCP, i'd like to know .. :)

You will need a [client](#clients) to speak with sloki.

## Protocols

### **Binary**

The binary protocol has been made with performance in mind. Payloads looks like JSONRPC, but it's not.
```
REQUEST                                     | RESPONSE
------------------------------------------- | --------------------------------------
{                                           | {
    "m":"myMethod",                         |   "r":true,
    "p":["foo","bar"],                      |   "id":"operation-uniq-id"
    "id":"operation-uniq-id"                | }
}                                           |
```
* Payload is a little lighter compared to compliant JSONRPC protocol described below (i.e no `jsonrpc` version attribute, `method` become `m`, `params` become `p`, `result` become `r`)
* [Missive](https://github.com/StarryInternet/missive) package is used both server and client side to transform payloads into a binary format. Missive support zlib compression, but it's not used here and it's not recommended because of performance crumble. Missive is based on [fringe](https://github.com/StarryInternet/fringe), an extensible message framing over streams for nodejs.

### **JSONRPC**

The JSONRPC protocol has been chosen for interoperability.
```
REQUEST                                     | RESPONSE
------------------------------------------- | --------------------------------------
{                                           | {
    "jsonrpc":"2.0",                        |   "jsonrpc":"2.0"
    "method":"myMethod",                    |   "result":true,
    "params":["foo","bar"],                 |   "id":"operation-uniq-id"
    "id":"operation-uniq-id"                | }
}                                           |
```
* Raw and standard JSONRPC over TCP
* [jayson](https://github.com/tedeh/jayson) package is used server side. Actually only TCP transport is implemented, but HTTP(s) JSON API and websocket API may be implemented in the future.   

### **Dinary**

It's not a typo. Dinary use 2 Binary clients, one socket for requests, the other one for responses. This is the fastest protocol, the one by default.

The underling protocol is the same as the Binary one.

-----

## Server

### Installation

```
npm install -g sloki
```

### Run

```
sloki
```

## Help

```
sloki --help

=======================================================================
              Sloki - a NodeJS Server for LokyJS
=======================================================================
 Environment variable              Default
   SLOKI_TCP_BINARY_ENABLE         true
   SLOKI_TCP_BINARY_PORT           6370
   SLOKI_TCP_BINARY_HOST           localhost
   SLOKI_TCP_BINARY_MAX_CLIENTS    64
   SLOKI_TLS_BINARY_ENABLE         true
   SLOKI_TLS_BINARY_PORT           6371
   SLOKI_TLS_BINARY_HOST           localhost
   SLOKI_TLS_BINARY_MAX_CLIENTS    64

   SLOKI_TCP_JSONRPC_ENABLE        true
   SLOKI_TCP_JSONRPC_PORT          6372
   SLOKI_TCP_JSONRPC_HOST          localhost
   SLOKI_TCP_JSONRPC_MAX_CLIENTS   64
   SLOKI_TLS_JSONRPC_ENABLE        true
   SLOKI_TLS_JSONRPC_PORT          6373
   SLOKI_TLS_JSONRPC_HOST          localhost
   SLOKI_TLS_JSONRPC_MAX_CLIENTS   64

   SLOKI_TCP_DINARY_ENABLE         true
   SLOKI_TCP_DINARY_PORT           6374
   SLOKI_TCP_DINARY_HOST           localhost
   SLOKI_TCP_DINARY_MAX_CLIENTS    64
   SLOKI_TLS_DINARY_ENABLE         true
   SLOKI_TLS_DINARY_PORT           6375
   SLOKI_TLS_DINARY_HOST           localhost
   SLOKI_TLS_DINARY_MAX_CLIENTS    64

   SLOKI_DIR                       /home/franck/.sloki
   SLOKI_SHOW_OPS_INTERVAL         0
   SLOKI_GC_INTERVAL               3600000
   SLOKI_MEM_LIMIT                 26094 Mb
-----------------------------------------------------------------------
 Command Line Options              Default
   --tcp-binary-enable             true
   --tcp-binary-port               6370
   --tcp-binary-host               localhost
   --tcp-binary-max-clients        64
   --tls-binary-enable             true
   --tls-binary-port               6371
   --tls-binary-host               localhost
   --tls-binary-max-clients        64
   --tcp-jsonrpc-enable            true
   --tcp-jsonrpc-port              6372
   --tcp-jsonrpc-host              localhost
   --tcp-jsonrpc-max-clients       64
   --tls-jsonrpc-enable            true
   --tls-jsonrpc-port              6373
   --tls-jsonrpc-host              localhost
   --tls-jsonrpc-max-clients       64
   --tcp-dinary-enable             undefined
   --tcp-dinary-port               6374
   --tcp-dinary-host               localhost
   --tcp-dinary-max-clients        64
   --tls-dinary-enable             true
   --tls-dinary-port               6375
   --tls-dinary-host               localhost
   --tls-dinary-max-clients        64
   --dir                           /home/franck/.sloki
   --show-ops-interval             0
   --gc-interval                   3600000
   --mem-limit                     26094 Mb
-----------------------------------------------------------------------
Examples:
$ sloki     # will use defaults
$ sloki --tcp-binary-port=6370 --tcp-binary-host=localhost
```
-----

## Clients

### NodeJS
See https://github.com/sloki-project/sloki-node-client

The client will load every methods that sloki server have.



## Benchmarks

```
> npm run bench

#################################################################################
# Benchmark suite using sloki v0.0.8    Intel® Core™ i7-6820HQ 2.70Ghz
#################################################################################
# x64 | 8 CPU(s) | linux (4.4.0-43-Microsoft Linux) | node v11.10.0
#################################################################################
> client connected (binary)
> client connected (binarys)
> client connected (jsonrpc)
> client connected (jsonrpcs)
> client connected (dinary)
> client connected (dinarys)
>>>>> test insert#nocallback
> run insert#nocallback@binary
> run insert#nocallback@binarys
> run insert#nocallback@jsonrpc
> run insert#nocallback@jsonrpcs
> run insert#nocallback@dinary
> run insert#nocallback@dinarys
>>>>> test insert#callback.fullDocument
> run insert#callback.fullDocument@binary
> run insert#callback.fullDocument@binarys
> run insert#callback.fullDocument@jsonrpc
> run insert#callback.fullDocument@jsonrpcs
> run insert#callback.fullDocument@dinary
> run insert#callback.fullDocument@dinarys
>>>>> test insert#callback.sret.01
> run insert#callback.sret.01@binary
> run insert#callback.sret.01@binarys
> run insert#callback.sret.01@jsonrpc
> run insert#callback.sret.01@jsonrpcs
> run insert#callback.sret.01@dinary
> run insert#callback.sret.01@dinarys
>>>>> gc done (rss before 206 MB, after 194 MB)
> client disconnected (binary)
> client disconnected (binarys)
> client disconnected (jsonrpc)
> client disconnected (jsonrpcs)
> client disconnected (dinary)
> client disconnected (dinarys)

# --------------------------------------------------------------------------------
# Test                                     | Operations | ops/sec | exec time
# --------------------------------------------------------------------------------
# insert#nocallback@binary                 |      20000 |   12462 |    1.6s
# insert#nocallback@binarys                |      20000 |  314297 |    64ms
# insert#nocallback@jsonrpc                |      20000 |   19875 |      1s
# insert#nocallback@jsonrpcs               |      20000 |  359086 |    56ms
# insert#nocallback@dinary                 |      20000 |   14190 |    1.4s
# insert#nocallback@dinarys                |      20000 |  939276 |    22ms
# insert#callback.fullDocument@binary      |      20000 |   11682 |    1.7s
# insert#callback.fullDocument@binarys     |      20000 |    9542 |    2.1s
# insert#callback.fullDocument@jsonrpc     |      20000 |   17443 |    1.1s
# insert#callback.fullDocument@jsonrpcs    |      20000 |   17136 |    1.2s
# insert#callback.fullDocument@dinary      |      20000 |   11089 |    1.8s
# insert#callback.fullDocument@dinarys     |      20000 |   26836 |   746ms
# insert#callback.sret.01@binary           |      20000 |   11939 |    1.7s
# insert#callback.sret.01@binarys          |      20000 |   27308 |   733ms
# insert#callback.sret.01@jsonrpc          |      20000 |   17117 |    1.2s
# insert#callback.sret.01@jsonrpcs         |      20000 |   17031 |    1.2s
# insert#callback.sret.01@dinary           |      20000 |   11184 |    1.8s
# insert#callback.sret.01@dinarys          |      20000 |   26900 |   744ms
```

The winner is dinary protocol !

## Development status

Not usable yet.

-----


The default values ​​can be overridden first with those of the environment variables,
and then those of the command line options.

* SLOKI_DIR `/path/to/sloki`
  * default is user's home (~user/.sloki)
  * subdirectory `dbs` contains lokijs databases
  * subdirectory `certs` contains SSL Certificates for TLS
  * directories will be created if not exist

* SLOKI_MEM_LIMIT
  * by default, 80% of the available memory

* SLOKI_GC_INTERVAL
  * run nodejs garbage collector at regular interval (value in milliseconds)
