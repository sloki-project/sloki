# Sloki (WORK IN PROGRESS)
A NodeJS Server for [LokiJS](http://lokijs.org/)

[![Join the chat at https://gitter.im/sloki-server/community](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sloki-server/community)
[![alt CI-badge](https://travis-ci.org/sloki-project/sloki.svg?branch=master)](https://travis-ci.org/sloki-project/sloki)
[![npm version](https://badge.fury.io/js/sloki.svg?v=0)](http://badge.fury.io/js/sloki)
[![Known Vulnerabilities](https://snyk.io/test/github/sloki-project/sloki/badge.svg?targetFile=package.json)](https://snyk.io/test/github/sloki-project/sloki?targetFile=package.json)
[![Dependencies](https://david-dm.org/sloki-project/sloki.svg)](https://david-dm.org/sloki-project/sloki)
[![Dev Dependencies](https://david-dm.org/sloki-project/sloki/dev-status.svg)](https://david-dm.org/sloki-project/sloki?type=dev)


## Overview

Sloki make LokiJS ***scalable***.

* It embed [LokiJS](http://lokijs.org/)
* It expose as you want
  * TCP: a [JSONRPC](https://www.jsonrpc.org/) API, thanks to [Jayson](https://github.com/tedeh/jayson)
  * TCP: a custom protocol like JSONRPC but will less bytes, for performance
* It **MAY** support HTTP/HTTPS
* It **MAY** support Websockets

```
                                         TCP|TLS|HTTP|HTTPS

        +----------------------------+                         +-----------------------------------+
        |                            |                         |              sloki                |
        |       NodeJS Daemon        |<----------------------->|                                   |
        |                            |                         |                                   |
        +----------------------------+                         |    +-------------------------+    |
                                                               |    |                         |    |
        +----------------------------+                         |    |                         |    |
        |                            |                         |    |                         |    |
        |       NodeJS Daemon        |<----------------------->|    |         LokiJS          |    |
        |                            |                         |    | fast in-memory database |    |
        +----------------------------+                         |    |                         |    |
                                                               |    |                         |    |
        +----------------------------+                         |    +-------------------------+    |
        |                            |                         |                                   |
        |           CLI              |<----------------------->|                                   |
        |                            |                         |                                   |
        +----------------------------+                         +-----------------------------------+
```

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
Environnement variable          Default
   SLOKI_DIR                    /home/franck/.sloki/dbs
   SLOKI_TCP_ENGINE             binary
   SLOKI_TCP_PORT               6370
   SLOKI_TCP_HOST               127.0.0.1
   SLOKI_TCP_MAX_CLIENTS        64
   SLOKI_TCP_DEBUG              true
   SLOKI_SHOW_OPS_INTERVAL      0
   SLOKI_GC_INTERVAL            3600000
   SLOKI_MEM_LIMIT              26094 Mb
---------------------------------------------------------------
Command Line Options            Default
   --dir                        /home/franck/.sloki/dbs
   --tcp-engine                 binary
   --tcp-port                   6370
   --tcp-host                   127.0.0.1
   --tcp-max-clients            64
   --tcp-debug                  true
   --show-ops-interval          0
   --gc-interval                3600000
   --mem-limit                  26094 Mb
---------------------------------------------------------------
Examples:
$ sloki
$ sloki --tcp-port=6370 --tcp-host=127.0.0.1
```
