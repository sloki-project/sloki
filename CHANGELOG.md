# Changelog

## [0.0.9](https://github.com/sloki-project/sloki/milestone/7) - 2019-03-02

### Added
* add "Dinary" protocol support [#33](https://github.com/sloki-project/sloki/issues/33)



## [0.0.8](https://github.com/sloki-project/sloki/milestone/6) - 2019-02-23

### Changed
* fix some require path for docker


## [0.0.7](https://github.com/sloki-project/sloki/milestone/5) - 2019-02-23

### Added
* add method `versions` [#19](https://github.com/sloki-project/sloki/issues/19)
* add alias property for all methods [#21](https://github.com/sloki-project/sloki/issues/21)
* add binary tcp protocol [#22](https://github.com/sloki-project/sloki/issues/22)
* add manual garbage collector [#23](https://github.com/sloki-project/sloki/issues/23) [#24](https://github.com/sloki-project/sloki/issues/24)
* TLS: generate self signed certificate when sloki start [#26](https://github.com/sloki-project/sloki/issues/26)
* TLS: implement both jsonrpc and binary server [#27](https://github.com/sloki-project/sloki/issues/27)

### Changed
* switch to named parameter in jsonrpc layer [#20](https://github.com/sloki-project/sloki/issues/20)
* switch to switch to loki-fs-structured-adapter by default [#32](https://github.com/sloki-project/sloki/issues/32)
* listen on multiple port per transport/protocol by default [#25](https://github.com/sloki-project/sloki/issues/25)


## [0.0.6](https://github.com/sloki-project/sloki/milestone/4) - 2019-02-09

### Added
* add method `wait` for testing purpose [(one sec)](https://github.com/sloki-project/sloki/commit/80c51ac81d18e18794f1782486aec9d8b4166c55)

### Changed
* fix db is not sticked to tcp session if db already exists [#17](https://github.com/sloki-project/sloki/issues/17)
* improve find filters [#18](https://github.com/sloki-project/sloki/issues/18)



## [0.0.5](https://github.com/sloki-project/sloki/milestone/3) - 2019-02-08

### Added
* add method collection/`update` [#5](https://github.com/sloki-project/sloki/issues/5)
* add method collection/`find` [#3](https://github.com/sloki-project/sloki/issues/3)
* add method collection/`remove` [#4](https://github.com/sloki-project/sloki/issues/4)
* add method collection/`get` [#2](https://github.com/sloki-project/sloki/issues/2)

### Changed
* fix client destroy connexion when client end [#15](https://github.com/sloki-project/sloki/issues/15)
* fix insert return behavior [#9](https://github.com/sloki-project/sloki/issues/9)
* improve code: merge jsonrpc/lokijs layers [#14](https://github.com/sloki-project/sloki/issues/14)
* improve method collection/insert options [#11](https://github.com/sloki-project/sloki/issues/11)
* improve sanity check [#10](https://github.com/sloki-project/sloki/issues/10)


## [0.0.4](https://github.com/sloki-project/sloki/milestone/2) - 2019-02-07

### Added
* add JSONRPC over tcp layer (jayson)
* add method server/`clients`
* add method server/`methods`
* add method server/`maxClients`
* add method server/`quit`
* add method server/`shutdown`
* add method database/`db`
* add method database/`loadDatabase`
* add method database/`listDatabases`
* add method database/`saveDatabase`
* add method database/`addCollection`
* add method database/`listCollections`
* add method collection/`get`
* add method collection/`insert`
* add tests



## 0.0.0

* Start
