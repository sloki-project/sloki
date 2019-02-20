# Sloki (WORK IN PROGRESS)
A NodeJS Server for [LokiJS](http://lokijs.org/)

[![Join the chat at https://gitter.im/sloki-server/community](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sloki-server/community)
[![alt CI-badge](https://travis-ci.org/sloki-project/sloki.svg?branch=master)](https://travis-ci.org/sloki-project/sloki)
[![npm version](https://badge.fury.io/js/sloki.svg?v=0)](http://badge.fury.io/js/sloki)
[![Known Vulnerabilities](https://snyk.io/test/github/sloki-project/sloki/badge.svg?targetFile=package.json)](https://snyk.io/test/github/sloki-project/sloki?targetFile=package.json)
[![Dependencies](https://david-dm.org/sloki-project/sloki.svg)](https://david-dm.org/sloki-project/sloki)
[![Dev Dependencies](https://david-dm.org/sloki-project/sloki/dev-status.svg)](https://david-dm.org/sloki-project/sloki?type=dev)

-----
## Documentation
1. [Introduction](#1-introduction)
    1. [Transports](#2-transports)
    2. [Protocols](#3-protocols)
        1. [Binary](#3i-binary-protocol-default) (default)
        2. [JSONRPC](#3ii-jsonrpc)
2. [Installation](#4-installation)
-----

## 1. Introduction

Sloki is a nodejs server which embed [LokiJS](http://lokijs.org/), a blazing fast in-memory documents database.
Sloki help to make LokiJS ***scalable*** : you can now have multiple processes speaking with LokiJS through Sloki.

A possible architecture using sloki :
```                  

    +----------------------------+    TCP / Binary     +-----------------------------------+
    |   NodeJS app worker #1     |<------------------->|                                   |
    +----------------------------+                     |               Sloki               |
                                                       |                                   |
    +----------------------------+    TCP / Binary     |    +-------------------------+    |
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

## 2. Transports

For moment, only TCP transport is supported. The advantage of TCP vs HTTP API is that the connection is persistent.

By default, Sloki listens on the following ports:

| Port      | Transport  | TLS  | Protocol         | Note             
|:---------:|------------|------|------------------|------------
| 6370      | TCP        | NO   | Binary (fastest) | implemented
| 6371      | TCP        | YES  | Binary (fastest) | TODO
| 6372      | TCP        | NO   | JSONRPC          | implemented
| 6373      | TCP        | YES  | JSONRPC          | TODO


You will need a [client](#clients) to speak with sloki.

## 3. Protocols

### 3.i. Binary protocol (default)

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

### 3.ii. **JSONRPC**

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

-----

## Server Installation

* ```npm install -g sloki```

## Server Usage

* `sloki`
* `sloki --help`

-----

## Client

See https://github.com/sloki-project/sloki-node-client

The client will load every methods that sloki server have, so, the client documentation is not really usefull



## Benchmarks

See https://github.com/sloki-project/sloki-benchs


## Development status

#### Legends

| Icon              | Description                
|:-----------------:|----------------------------------------------------------------------
| :heavy_check_mark:| implemented
| :heavy_plus_sign: | in progress/MUST be implemented
| :red_circle:      | does NOT make sens in sloki, will NOT be implemented
| :question:        | MAY be implemented


<details>
<summary>
<b><img src="http://progressed.io/bar/25"/> Transports</b>
</summary>
<p>

| Status            | Transport            | Notes               
|:-----------------:|----------------------|--------------------------------
| :heavy_check_mark:| TCP                  | Persistant connection
| :heavy_plus_sign: | TLS                  | Persistant connection
| :question:        | HTTP                 |
| :question:        | HTTPS                |
</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/100"/> Methods: client and server related</b>
</summary>
<p>

| Status            | Method            | Parameter     | Description                
|:-----------------:|-------------------|---------------|----------------
| :heavy_check_mark:| clients           |               | return TCP/TLS connected clients
| :heavy_check_mark:| gc                |               | invoke gc(), for testing purpose
| :heavy_check_mark:| maxClients        |               | return TCP/TLS maxClients
| :heavy_check_mark:| maxClients        | maxClients    | set TCP/TLS maxClients
| :heavy_check_mark:| memory            |               | return sloki memory usage
| :heavy_check_mark:| methods           |               | return sloki methods
| :heavy_check_mark:| quit              |               | disconnect (TCP/TLS clients only)
| :heavy_check_mark:| shutdown          |               | shutdown sloki
| :heavy_check_mark:| version           |               | return versions (sloki, lokijs, sloki-node-client)
| :heavy_check_mark:| wait              |               | wait for one second, for testing purpose

</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/77"/> Methods: database related</b>
</summary>
<p>

[Loki Class (Database) documentation](https://rawgit.com/techfort/LokiJS/master/jsdoc/Loki.html)

| Status            | Command                       | Parameter(s)                  | Description  
|:-----------------:|-------------------------------|-------------------------------|----------------              
| :heavy_check_mark:| loadDatabase                  | databaseName,[options]        | select (and load if needed) a database
| :heavy_check_mark:| db                            |                               | return current database name (sloki specific)
| :heavy_check_mark:| listDatabases                 |                               | return available databases
| :heavy_check_mark:| saveDatabase                  |                               | trigger manual saving of the selected database
| :heavy_check_mark:| listCollections               |                               | return available collections in selected database
| :heavy_check_mark:| addCollection                 | options                       | add a collection in selected database
| :heavy_check_mark:| getCollection                 | collectionName                | return collection properties in selected database
| :heavy_plus_sign: | removeCollection              | collectionName                | removes a collection from the selected database
| :heavy_plus_sign: | renameCollection              | oldName, newName              | renames an existing collection in the selected database
| :question:        | clearChanges                  |                               | clears all the changes in all collections of selected database
| :question:        | close                         |                               | close selected database
| :question:        | configureOptions              | options                       | reconfigure selected database options
| :question:        | copy                          | options                       | copy selected database into a new Loky instance
| :question:        | deleteDatabase                |                               | delete selected database
| :question:        | getCollection                 | collectionName                | Retrieves reference to a collection by name
| :red_circle:      | deserializeCollection         |                               | see LokiJS Class documentation
| :red_circle:      | deserializeDestructured       |                               | see LokiJS Class documentation
| :red_circle:      | generateChangesNotification   |                               | see LokiJS Class documentation
| :red_circle:      | loadDatabase                  |                               | see "use" command
| :red_circle:      | loadJSON                      |                               | see LokiJS Class documentation
| :red_circle:      | loadJSONObject                |                               | see LokiJS Class documentation
| :red_circle:      | serialize                     |                               | see LokiJS Class documentation
| :red_circle:      | serializeChanges              |                               | see LokiJS Class documentation
| :red_circle:      | serializeCollection           | options                       | see LokiJS Class documentation
| :red_circle:      | serializeDestructured         | options                       | see LokiJS Class documentation
| :red_circle:      | throttledSaveDrain            |                               | see LokiJS Class documentation

</p>
</details>


<details>
<summary>
<b><img src="http://progressed.io/bar/10"/> Methods: collection related</b>
</summary>
<p>

[Loki Collection documentation](https://rawgit.com/techfort/LokiJS/master/jsdoc/Collection.html)

| Status            | Command                       | Parameter(s)                      | Description  
|:-----------------:|-------------------------------|-----------------------------------|----------------
| :heavy_check_mark:| find                          | collectionName, filter            | find document(s)
| :heavy_check_mark:| get                           | collectionName, lokiId            | return a document by his id         
| :heavy_check_mark:| insert                        | collectionName, document          | insert one or more document(s)
| :heavy_check_mark:| remove                        | collectionName, document or id    | remove one or more document(s)
| :heavy_check_mark:| update                        | collectionName, document          | update a document

</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/2"/> Benchmarks</b>
</summary>
<p>

| Status            | Transport            | Notes               
|:-----------------:|----------------------|--------------------------------
| :heavy_plus_sign: | TCP                  | Persistant connection
| :heavy_plus_sign: | TLS                  | Persistant connection
| :question:        | HTTP                 |
| :question:        | HTTPS                |

</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/10"/> Tools</b>
</summary>
<p>

| Status             | Tool                 | Notes               
|:------------------:|----------------------|--------------------------------
| :heavy_plus_sign:  | CLI                  | CLI using TCP transport

</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/0"/> Improvements on top of LokiJS</b>
</summary>
<p>

| Status             | Improvement          | Notes               
|:------------------:|----------------------|--------------------------------
| :heavy_plus_sign:  | Authentication       | Optional authentication layer (all transports)

</p>
</details>

-----

## Server options

`$ sloki --help`

```
===============================================================
              Sloki - a NodeJS Server for LokyJS
===============================================================
Environment variable            Default
   SLOKI_DIR                    ~user/.sloki/dbs
   SLOKI_TCP_ENGINE             binary
   SLOKI_TCP_PORT               6370
   SLOKI_TCP_HOST               127.0.0.1
   SLOKI_TCP_MAX_CLIENTS        64
   SLOKI_TCP_DEBUG              true
   SLOKI_SHOW_OPS_INTERVAL      0
   SLOKI_GC_INTERVAL            3600000
   SLOKI_MEM_LIMIT              ...
---------------------------------------------------------------
Command Line Options            Default
   --dir                        ~user/.sloki/dbs
   --tcp-engine                 binary
   --tcp-port                   6370
   --tcp-host                   127.0.0.1
   --tcp-max-clients            64
   --tcp-debug                  true
   --show-ops-interval          0
   --gc-interval                3600000
   --mem-limit                  ...
---------------------------------------------------------------
Examples:
$ sloki
$ sloki --tcp-port=6370 --tcp-host=127.0.0.1
```

The default values ​​can be overridden first with those of the environment variables,
and then those of the command line options.

* SLOKI_DIR `/path/to/lokijs/databases`
  * default is user's home (~user/.sloki/dbs)
  * directory where lokijs will save databases as json files
  * directory will be created if not exist
  * may be overriden

* SLOKI_TCP_ENGINE [binary|jsonrpc]
  * binary (default) is a JSONRPC like custom binary protocol
  * jsonrpc is a pure JSONRPC (jayson) protocol

* SLOKI_MEM_LIMIT
  * by default, it's 80% of appliance/VM available memory

* SLOKI_GC_INTERVAL ()
  * run nodejs garbage collector
