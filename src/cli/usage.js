const use = require('abrequire');
const ENV = use('src/env');

console.log('Usage: loki-cli <url>');
console.log();
console.log('Examples:');
console.log('   loki-cli tcp://localhost:'+ENV.NET_TCP_PORT);
console.log('   loki-cli tls://localhost:'+ENV.NET_TCP_PORT);
