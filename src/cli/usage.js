const use = require('abrequire');
const config = use('src/config');

console.log('Usage: sloki-cli <url>');
console.log();
console.log('Examples:');
console.log('   sloki-cli tcp://localhost:'+config.NET_TCP_PORT);
console.log('   sloki-cli tls://localhost:'+config.NET_TCP_PORT);
