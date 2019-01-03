# LokiJS-Server
A TCP/HTTP Server for [LokiJS](http://lokijs.org/)

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
| LOKY_EXPOSE  | TCP | [TCP\|HTTP\|TCP-HTTP] |  |

* Command line options

| Option   | Default Value  | Possible values | Implemented since version
|---|---|---|---|
| path  | ~/.lokyjs  | |
| expose  | TCP | [TCP\|HTTP\|TCP-HTTP] | |


## Current state

See [CHANGELOG.md](/CHANGELOG.md)


## Roadmap (TODO)

