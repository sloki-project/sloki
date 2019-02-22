const config = require('../config');

console.log('Usage: sloki-cli <url>');
console.log();
console.log('Examples with ports:');
console.log(`sloki-cli tcp://localhost:${config.TCP_BINARY_PORT}`);
console.log(`sloki-cli tls://localhost:${config.TLS_BINARY_PORT}`);
console.log(`sloki-cli binary://localhost:${config.TCP_BINARY_PORT}`);
console.log(`sloki-cli binarys://localhost:${config.TLS_BINARY_PORT}`);
console.log(`sloki-cli jsonrpc://localhost:${config.TCP_JSONRPC_PORT}`);
console.log(`sloki-cli jsonrpcs://localhost:${config.TLS_JSONRPC_PORT}`);
console.log('');
console.log('Notes:');
console.log(' * tcp protocol is an alias for binary protocol');
console.log(' * tls protocol is an alias for binarys protocol');
console.log(' * you may not specify the port, in which case the default ports will be used.');
