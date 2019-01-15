const use = require('abrequire');
const ENV = use('src/env');

module.exports = {
    tcp:'tcp://'+ENV.NET_TCP_HOST+':'+ENV.NET_TCP_PORT
}
