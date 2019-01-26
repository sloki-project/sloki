const use = require('abrequire');
const ENV = use('src/env');

console.log('Usage: sloki-cli <url>');
console.log();
console.log('Examples:');
console.log('   sloki-cli tcp://localhost:'+ENV.NET_TCP_PORT);
console.log('   sloki-cli tls://localhost:'+ENV.NET_TCP_PORT);
