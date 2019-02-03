# Sloki (WORK IN PROGRESS)
A NodeJS Server for [LokiJS](http://lokijs.org/)

[![Join the chat at https://gitter.im/sloki-server/community](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sloki-server/community)
[![alt CI-badge](https://travis-ci.org/sloki-project/sloki.svg?branch=master)](https://travis-ci.org/sloki-project/sloki)
[![npm version](https://badge.fury.io/js/sloki.svg?v=0)](http://badge.fury.io/js/sloki)
[![alt packagequality](http://npm.packagequality.com/shield/sloki.svg)](http://packagequality.com/#?package=sloki)
[![Known Vulnerabilities](https://snyk.io/test/github/sloki-project/sloki/badge.svg?targetFile=package.json)](https://snyk.io/test/github/sloki-project/sloki?targetFile=package.json)
[![Dependencies](https://david-dm.org/sloki-project/sloki)](https://david-dm.org/sloki-project/sloki.svg)
[![Dependencies](https://david-dm.org/sloki-project/sloki?type=dev)](https://david-dm.org/sloki-project/sloki.svg?type=dev)
## Overview

Sloki make LokiJS ***scalable***.

* It embed [LokiJS](http://lokijs.org/)
* It expose a [JSONRPC](https://www.jsonrpc.org/) API, thanks to [Jayson](https://github.com/tedeh/jayson)
* It **WILL** support TCP/TLS
* It **MAY** support HTTP/HTTPS

```
                                          JSONRPC (jayson)
                                         TCP|TLS|HTTP|HTTPS

        +----------------------------+                         +----------------------------------+
        |                            |                         |          sloki           |
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

-----

## Installation

* ```npm install -g sloki```

## Usage

* `sloki`
* `sloki --help`

-----

## Client

See https://github.com/sloki-project/sloki-node-client

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
<b><img src="http://progressed.io/bar/100"/> Commands: client and server related</b>
</summary>
<p>

| Status            | Command           | Parameter     | Description                
|:-----------------:|-------------------|---------------|----------------
| :heavy_check_mark:| quit              |               | disconnect (TCP/TLS clients only)
| :heavy_check_mark:| shutdown          |               | shutdown sloki
| :heavy_check_mark:| memory            |               | return sloki memory usage
| :heavy_check_mark:| clients           |               | return TCP/TLS connected clients
| :heavy_check_mark:| maxClients        |               | return TCP/TLS maxClients
| :heavy_check_mark:| maxClients        | maxClients    | set TCP/TLS maxClients
| :heavy_check_mark:| commands          |               | return available commands

</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/77"/> Commands: database related</b>
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
<b><img src="http://progressed.io/bar/5"/> Commands: collection related</b>
</summary>
<p>

[Loki Collection documentation](https://rawgit.com/techfort/LokiJS/master/jsdoc/Collection.html)

| Status            | Command                       | Parameter(s)                  | Description  
|:-----------------:|-------------------------------|-------------------------------|----------------              
| :heavy_check_mark:| insert                        | collectionName, document      | insert a document
| :heavy_check_mark:| get                           | collectionName, lokiId        | return a document by his id

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

TODO
