const use = require('abrequire');
const config = use('src/config');

module.exports = {
    tcp:'tcp://'+config.NET_TCP_HOST+':'+config.NET_TCP_PORT
};
