const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const homedir = require('os').homedir();
const totalmem = require('os').totalmem();


const defaults = {

    // manual garbage collector, use --expose-gc to enable it
    // default is 5mn
    GC_INTERVAL: 1000*60*5,
    MEM_LIMIT:Math.round((totalmem-(totalmem*0.20))/1024/1024),   // in Mb
    MEM_LIMIT_REACHED:false,

    // default database dir is in the home of the user
    DATABASES_DIRECTORY:path.resolve(homedir+'/.sloki/dbs'),
    DATABASES_AUTOSAVE_INTERVAL:1000*60,
    DATABASES_FORCE_SAVE_ON_CREATE:true,

    // TCP API enabled by default
    NET_TCP_PORT:6370,
    NET_TCP_HOST:'127.0.0.1',
    NET_TCP_DEBUG:true,
    NET_TCP_PROMPT:'> ',
    NET_TCP_EOF:'\r\n',
    NET_TCP_OUTPUT_FORMAT:'text',  // or json
    NET_TCP_ENGINE:'binary',

    // limit number of simultaneously connected clients, for basic security reasons
    NET_TCP_MAX_CLIENTS:64,

    // HTTP API is disabled by default for moment (not implemented yet)
    NET_HTTP_PORT:null,
    NET_HTTP_HOST:'127.0.0.1',

    // Below some variable to benchs and tests
    // Show number of operation per interval
    SHOW_OPS_INTERVAL:1000,
};

const config = Object.assign({}, defaults);

/*******************************************
 * command line help with default values
 *******************************************/

if (argv.help) {
    console.log();
    console.log('===============================================================');
    console.log('              Sloki - a NodeJS Server for LokyJS               ');
    console.log('===============================================================');
    console.log('Environnement variable          Default                        ');
    console.log(`   SLOKI_DIR                    ${config.DATABASES_DIRECTORY}  `);
    console.log(`   SLOKI_TCP_ENGINE             ${config.NET_TCP_ENGINE}       `);
    console.log(`   SLOKI_TCP_PORT               ${config.NET_TCP_PORT}         `);
    console.log(`   SLOKI_TCP_HOST               ${config.NET_TCP_HOST}         `);
    console.log(`   SLOKI_TCP_MAX_CLIENTS        ${config.NET_TCP_MAX_CLIENTS}  `);
    console.log(`   SLOKI_TCP_DEBUG              ${config.NET_TCP_DEBUG}        `);
    console.log(`   SLOKI_SHOW_OPS_INTERVAL      ${config.SHOW_OPS_INTERVAL}    `);
    console.log(`   SLOKI_GC_INTERVAL            ${config.GC_INTERVAL}          `);
    console.log(`   SLOKI_MEM_LIMIT              ${config.MEM_LIMIT} Mb         `);
    console.log('---------------------------------------------------------------');
    console.log('Command Line Options            Default                        ');
    console.log(`   --dir                        ${config.DATABASES_DIRECTORY}  `);
    console.log(`   --tcp-engine                 ${config.NET_TCP_ENGINE}       `);
    console.log(`   --tcp-port                   ${config.NET_TCP_PORT}         `);
    console.log(`   --tcp-host                   ${config.NET_TCP_HOST}         `);
    console.log(`   --tcp-max-clients            ${config.NET_TCP_MAX_CLIENTS}  `);
    console.log(`   --tcp-debug                  ${config.NET_TCP_DEBUG}        `);
    console.log(`   --show-ops-interval          ${config.SHOW_OPS_INTERVAL}    `);
    console.log(`   --gc-interval                ${config.GC_INTERVAL}          `);
    console.log(`   --mem-limit                  ${config.MEM_LIMIT} Mb         `);
    console.log('---------------------------------------------------------------');
    console.log('Examples:                                                      ');
    console.log('$ sloki                                                        ');
    console.log('$ sloki --tcp-port=6370 --tcp-host=127.0.0.1                   ');
    console.log();
    process.exit();
}

/***********************************
 * environnement variable override
 ***********************************/
if (process.env.SLOKI_DIR) {
    config.DATABASES_DIRECTORY = path.resolve(process.env.SLOKI_DIR);
}

if (process.config.SLOKI_TCP_ENGINE) {
    config.NET_TCP_ENGINE = process.env.SLOKI_TCP_ENGINE;
}

if (process.env.SLOKI_TCP_PORT) {
    config.NET_TCP_PORT = parseInt(process.env.SLOKI_TCP_PORT);
}

if (process.env.SLOKI_TCP_IP) {
    config.NET_TCP_IP = process.env.SLOKI_TCP_IP;
}

if (process.env.SLOKI_TCP_DEBUG) {
    if (process.env.SLOKI_TCP_DEBUG === 'true') {
        config.NET_TCP_DEBUG = true;
    } else {
        config.NET_TCP_DEBUG = false;
    }
}

if (process.env.SLOKI_TCP_MAX_CLIENTS) {
    config.NET_TCP_MAX_CLIENTS = parseInt(process.env.SLOKI_TCP_MAX_CLIENTS);
}

if (process.env.SLOKI_SHOW_OPS_INTERVAL) {
    config.SHOW_OPS_INTERVAL = parseInt(process.env.SLOKI_SHOW_OPS_INTERVAL);
}

if (process.env.SLOKI_GC_INTERVAL) {
    config.GC_INTERVAL = parseInt(process.env.SLOKI_GC_INTERVAL);
}

if (process.env.SLOKI_MEM_LIMIT) {
    config.MEM_LIMIT = parseInt(process.env.SLOKI_MEM_LIMIT);
}


/********************************
 * command line options override
 ********************************/

if (argv['dir']) {
    config.DATABASES_DIRECTORY = path.resolve(argv.dir);
}

if (argv['tcp-engine']) {
    config.NET_TCP_ENGINE = argv['tcp-engine'];
}

if (argv['tcp-port']) {
    config.NET_TCP_PORT = parseInt(argv['tcp-port']);
}

if (argv['tcp_host']) {
    config.NET_TCP_HOST = argv['tcp_host'];
}

if (argv['tcp-max-clients']) {
    config.NET_TCP_MAX_CLIENTS = parseInt(argv['tcp-max-clients']);
}

/*
if (argv['http-port']) {
    config.NET_HTTP_PORT = parseInt(argv['http-port']);
}

if (argv['http-host']) {
    config.NET_HTTP_HOST = parseInt(argv['http-host']);
}
*/

if (argv['show-ops-interval']) {
    config.SHOW_OPS_INTERVAL = parseInt(argv['show-ops-interval']);
}

if (argv['gc-interval']) {
    config.GC_INTERVAL = parseInt(argv['gc-interval']);
}

if (argv['mem-limit']) {
    config.MEM_LIMIT = parseInt(argv['mem-limit']);
}

/********************************
 * integrity checks
 ********************************/

const ERROR_BAD_NET_TCP_PORT = 'tcp port variable must be > 1 and < 65535';
const ERROR_BAD_NET_TCP_MAX_CLIENTS = 'maxClients must be > 1 and < 1024';
const ERROR_BAD_NET_TCP_MAX_CLIENTS_TYPE = 'maxClients should be a number';
const ERROR_BAD_GC_INTERVAL = 'garbage collector should be in millisecond, and > 0';
const ERROR_BAD_MEM_LIMIT = 'memory limit should be in MegaBytes, and > 0';

if (isNaN(config.NET_TCP_PORT) || config.NET_TCP_PORT<1 || config.NET_TCP_PORT>65534) {
    throw new Error(ERROR_BAD_NET_TCP_PORT);
}

if (isNaN(config.NET_TCP_MAX_CLIENTS) || !config.NET_TCP_MAX_CLIENTS) {
    throw new Error(ERROR_BAD_NET_TCP_MAX_CLIENTS_TYPE);
}

if (config.NET_TCP_MAX_CLIENTS<1||config.NET_TCP_MAX_CLIENTS>1024) {
    throw new Error(ERROR_BAD_NET_TCP_MAX_CLIENTS);
}

if (config.NET_TCP_ENGINE != 'jsonrpc' && config.NET_TCP_ENGINE != 'binary') {
    throw new Error(`Unknow engine ${config.NET_TCP_ENGINE}`);
}

if (isNaN(config.GC_INTERVAL) || !config.GC_INTERVAL) {
    throw new Error(ERROR_BAD_GC_INTERVAL);
}

if (isNaN(config.MEM_LIMIT) || !config.MEM_LIMIT) {
    throw new Error(ERROR_BAD_MEM_LIMIT);
}

module.exports = config;
