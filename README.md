# LokiJS-Server (WORK IN PROGRESS)
A NodeJS TCP/TLS (HTTP/HTTPS?) Server for [LokiJS](http://lokijs.org/)

[![Join the chat at https://gitter.im/techfort/LokiJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/LokiJS-Server/community)
[![alt CI-badge](https://travis-ci.org/franck34/LokiJS-Server.svg?branch=master)](https://travis-ci.org/franck34/LokiJS-Server)
[![npm version](https://badge.fury.io/js/lokijs-server.svg)](http://badge.fury.io/js/lokijs-server)
[![alt packagequality](http://npm.packagequality.com/shield/lokijs-server.svg)](http://packagequality.com/#?package=lokijs-server)
[![Known Vulnerabilities](https://snyk.io/test/github/franck34/LokiJS-Server/badge.svg?targetFile=package.json)](https://snyk.io/test/github/franck34/LokiJS-Server?targetFile=package.json)

## Overview

LokiJS-Server make LokiJS ***scalable***.

* It embed [LokiJS](http://lokijs.org/)
* It expose a [JSONRPC](https://www.jsonrpc.org/) API, thanks to [Jayson](https://github.com/tedeh/jayson)
* It **WILL** support TCP/TLS
* It **MAY** support HTTP/HTTPS

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

-----

## Installation

Copy paste line you want :)

* locally:
  * ```npm install LokiJS-Server```
  * ```yarn add LokiJS-Server```

* globally:
  * ```npm install -g LokiJS-Server```
  * ```yarn add -g LokiJS-Server```

-----

## Usage

Not usable yet.

----

## Development status

#### Legends

| Icon              | Description                
|:-----------------:|----------------------------------------------------------------------
| :heavy_check_mark:| implemented
| :heavy_plus_sign: | in progress/MUST be implemented
| :red_circle:      | does NOT make sens in LokiJS-Server, will NOT be implemented
| :question:        | MAY be implemented


<details>
<summary>
<b><img src="http://progressed.io/bar/25"/> Transports</b>
</summary>
<p>

| Status            | Transport            | Notes               
|:-----------------:|----------------------|--------------------------------
| :heavy_check_mark:| TCP                  | Persistant connection
| :heavy_plus_sign: | TLS                  |
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
| :heavy_check_mark:| shutdown          |               | shutdown LokiJS-Server
| :heavy_check_mark:| memory            |               | return LokiJS-Server memory usage
| :heavy_check_mark:| clients           |               | return TCP/TLS connected clients
| :heavy_check_mark:| maxClients        |               | return TCP/TLS maxClients
| :heavy_check_mark:| maxClients        | maxClients    | set TCP/TLS maxClients
| :heavy_check_mark:| commands          |               | return available commands

</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/50"/> Commands: database related</b>
</summary>
<p>

[Loki Class (Database) documentation](https://rawgit.com/techfort/LokiJS/master/jsdoc/Loki.html)

| Status            | Command                       | Parameter(s)      | Description  
|:-----------------:|-------------------------------|-------------------|----------------              
| :heavy_check_mark:| use                           | databaseName      | select (and load if needed) a database (LokiJS-Server specific)
| :heavy_check_mark:| db                            |                   | return current database name (LokiJS-Server specific)
| :heavy_check_mark:| listDatabases                 |                   | return available databases
| :heavy_check_mark:| listCollections               |                   | return available collections in selected database
| :heavy_plus_sign: | addCollection                 | options           | add a collection in selected database
| :heavy_plus_sign: | removeCollection              | collectionName    | removes a collection from the selected database
| :heavy_plus_sign: | renameCollection              | oldName, newName  | renames an existing collection in the selected database
| :heavy_plus_sign: | saveDatabase                  |                   | manually save selected database
| :question:        | clearChanges                  |                   | clears all the changes in all collections of selected database
| :question:        | close                         |                   | close selected database
| :question:        | configureOptions              | options           | reconfigure selected database options
| :question:        | copy                          | options           | copy selected database into a new Loky instance
| :question:        | deleteDatabase                |                   | delete selected database
| :question:        | getCollection                 | collectionName    | Retrieves reference to a collection by name
| :red_circle:      | deserializeCollection         |                   | see LokiJS Class documentation
| :red_circle:      | deserializeDestructured       |                   | see LokiJS Class documentation
| :red_circle:      | generateChangesNotification   |                   | see LokiJS Class documentation
| :red_circle:      | loadDatabase                  |                   | see "use" command
| :red_circle:      | loadJSON                      |                   | see LokiJS Class documentation
| :red_circle:      | loadJSONObject                |                   | see LokiJS Class documentation
| :red_circle:      | serialize                     |                   | see LokiJS Class documentation
| :red_circle:      | serializeChanges              |                   | see LokiJS Class documentation
| :red_circle:      | serializeCollection           | options           | see LokiJS Class documentation
| :red_circle:      | serializeDestructured         | options           | see LokiJS Class documentation
| :red_circle:      | throttledSaveDrain            |                   | see LokiJS Class documentation

</p>
</details>


<details>
<summary>
<b><img src="http://progressed.io/bar/0"/> Commands: collection related</b>
</summary>
<p>

[Loki Collection documentation](https://rawgit.com/techfort/LokiJS/master/jsdoc/Collection.html)

| Status            | Command                       | Parameter(s)      | Description  
|:-----------------:|-------------------------------|-------------------|----------------              

</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/0"/> Benchmarks</b>
</summary>
<p>

| Status            | Transport            | Notes               
|:-----------------:|----------------------|--------------------------------
| :heavy_plus_sign: | TCP                  | Persistant connection
| :heavy_plus_sign: | TLS                  |
| :question:        | HTTP                 |
| :question:        | HTTPS                |

</p>
</details>

<details>
<summary>
<b><img src="http://progressed.io/bar/0"/> Tools</b>
</summary>
<p>

| Status             | Tool                 | Notes               
|:------------------:|----------------------|--------------------------------
| :heavy_plus_sign:       | CLI                  | CLI using TCP transport

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

## Server options</b>

### Environnement variables

| Name              | Default Value     | Possible values       | Implemented since version
|-------------------|-------------------|-----------------------|----------------------------
| LOKI_DIR          | ~/.lokijs/dbs     |                       | 0.0.0
| LOKI_TRANSPORT    | TCP               | TCP\|HTTP\|TCP-HTTP   | 0.0.0

### Command line options

| Option            | Default Value     | Possible values       | Implemented since version
|-------------------|-------------------|-----------------------|--------
| dir               | ~/.lokijs/dbs     |                       | 0.0.0
| transport         | TCP               | TCP\|HTTP\|TCP-HTTP   | 0.0.0
