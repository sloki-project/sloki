const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const homedir = require('os').homedir();
const totalmem = require('os').totalmem();

const defaults = {

    // manual garbage collector, use --expose-gc to enable it
    // default is 1 hour
    GC_INTERVAL: 1000*60*60,
    MEM_LIMIT:Math.round((totalmem-(totalmem*0.20))/1024/1024),   // in Mb
    MEM_LIMIT_REACHED:false,

    // default database dir is in the home of the user
    SLOKI_DIR:path.resolve(homedir+'/.sloki'),

    DATABASES_DEFAULT_OPTIONS :  {
        //serializationMethod:'pretty',
        autoload:true,
        autosave:true,
        autosaveInterval:1000*60*5,
        throttledSaves:false
    },

    RE_COLLETION_NAME: '^[a-z0-9\-\.\_]{1,50}$',
    RE_DATABASE_NAME: '^[a-z0-9\-\.\_]{1,50}$',

    // http://jsonrpc.org/spec.html#error_object
    ERROR_CODE_PARAMETER: -32602,
    ERROR_CODE_INTERNAL: -32603,

    // listeners
    TCP_BINARY_ENABLE:true,
    TCP_BINARY_PORT:6370,
    TCP_BINARY_HOST:'localhost',
    TCP_BINARY_MAX_CLIENTS:64,

    TLS_BINARY_ENABLE:true,
    TLS_BINARY_PORT:6371,
    TLS_BINARY_HOST:'localhost',
    TLS_BINARY_MAX_CLIENTS:64,

    TCP_JSONRPC_ENABLE:true,
    TCP_JSONRPC_PORT:6372,
    TCP_JSONRPC_HOST:'localhost',
    TCP_JSONRPC_MAX_CLIENTS:64,

    TLS_JSONRPC_ENABLE:true,
    TLS_JSONRPC_PORT:6373,
    TLS_JSONRPC_HOST:'localhost',
    TLS_JSONRPC_MAX_CLIENTS:64,

    TCP_DINARY_ENABLE:true,
    TCP_DINARY_PORT:6374,
    TCP_DINARY_HOST:'localhost',
    TCP_DINARY_MAX_CLIENTS:64,

    TLS_DINARY_ENABLE:true,
    TLS_DINARY_PORT:6375,
    TLS_DINARY_HOST:'localhost',
    TLS_DINARY_MAX_CLIENTS:64,

    // Show number of operation per interval
    SHOW_OPS_INTERVAL:0,
};

if (process.env.DOCKER) {
    const ip = '0.0.0.0';
    defaults.TCP_BINARY_HOST = ip;
    defaults.TLS_BINARY_HOST = ip;
    defaults.TCP_JSONRPC_HOST = ip;
    defaults.TLS_JSONRPC_HOST = ip;
    defaults.TCP_DINARY_HOST = ip;
    defaults.TLS_DINARY_HOST = ip;
}

const c = JSON.parse(JSON.stringify(defaults));

const transports = ['TCP', 'TLS'];
const protocols = ['BINARY', 'JSONRPC', 'DINARY'];
const opts = ['ENABLE', 'PORT', 'HOST', 'MAX_CLIENTS'];

/*******************************************
 * command line help with default values
 *******************************************/

if (argv.help) {
    console.log();
    console.log('=======================================================================');
    console.log('              Sloki - a NodeJS Server for LokyJS                       ');
    console.log('=======================================================================');
    console.log(' Environment variable              Default                             ');
    console.log(`   SLOKI_TCP_BINARY_ENABLE         ${c.TCP_BINARY_ENABLE}              `);
    console.log(`   SLOKI_TCP_BINARY_PORT           ${c.TCP_BINARY_PORT}                `);
    console.log(`   SLOKI_TCP_BINARY_HOST           ${c.TCP_BINARY_HOST}                `);
    console.log(`   SLOKI_TCP_BINARY_MAX_CLIENTS    ${c.TCP_BINARY_MAX_CLIENTS}         `);
    console.log(`   SLOKI_TLS_BINARY_ENABLE         ${c.TLS_BINARY_ENABLE}              `);
    console.log(`   SLOKI_TLS_BINARY_PORT           ${c.TLS_BINARY_PORT}                `);
    console.log(`   SLOKI_TLS_BINARY_HOST           ${c.TLS_BINARY_HOST}                `);
    console.log(`   SLOKI_TLS_BINARY_MAX_CLIENTS    ${c.TLS_BINARY_MAX_CLIENTS}         `);
    console.log();
    console.log(`   SLOKI_TCP_JSONRPC_ENABLE        ${c.TCP_JSONRPC_ENABLE}             `);
    console.log(`   SLOKI_TCP_JSONRPC_PORT          ${c.TCP_JSONRPC_PORT}               `);
    console.log(`   SLOKI_TCP_JSONRPC_HOST          ${c.TCP_JSONRPC_HOST}               `);
    console.log(`   SLOKI_TCP_JSONRPC_MAX_CLIENTS   ${c.TCP_JSONRPC_MAX_CLIENTS}        `);
    console.log(`   SLOKI_TLS_JSONRPC_ENABLE        ${c.TLS_JSONRPC_ENABLE}             `);
    console.log(`   SLOKI_TLS_JSONRPC_PORT          ${c.TLS_JSONRPC_PORT}               `);
    console.log(`   SLOKI_TLS_JSONRPC_HOST          ${c.TLS_JSONRPC_HOST}               `);
    console.log(`   SLOKI_TLS_JSONRPC_MAX_CLIENTS   ${c.TLS_JSONRPC_MAX_CLIENTS}        `);
    console.log();
    console.log(`   SLOKI_TCP_DINARY_ENABLE         ${c.TCP_DINARY_ENABLE}              `);
    console.log(`   SLOKI_TCP_DINARY_PORT           ${c.TCP_DINARY_PORT}                `);
    console.log(`   SLOKI_TCP_DINARY_HOST           ${c.TCP_DINARY_HOST}                `);
    console.log(`   SLOKI_TCP_DINARY_MAX_CLIENTS    ${c.TCP_DINARY_MAX_CLIENTS}         `);
    console.log(`   SLOKI_TLS_DINARY_ENABLE         ${c.TLS_DINARY_ENABLE}              `);
    console.log(`   SLOKI_TLS_DINARY_PORT           ${c.TLS_DINARY_PORT}                `);
    console.log(`   SLOKI_TLS_DINARY_HOST           ${c.TLS_DINARY_HOST}                `);
    console.log(`   SLOKI_TLS_DINARY_MAX_CLIENTS    ${c.TLS_DINARY_MAX_CLIENTS}         `);
    console.log();
    console.log(`   SLOKI_DIR                       ${c.SLOKI_DIR}                      `);
    console.log(`   SLOKI_SHOW_OPS_INTERVAL         ${c.SHOW_OPS_INTERVAL}              `);
    console.log(`   SLOKI_GC_INTERVAL               ${c.GC_INTERVAL}                    `);
    console.log(`   SLOKI_MEM_LIMIT                 ${c.MEM_LIMIT} Mb                   `);
    console.log('-----------------------------------------------------------------------');
    console.log(' Command Line Options              Default                             ');
    console.log(`   --tcp-binary-enable             ${c.TCP_BINARY_ENABLE}              `);
    console.log(`   --tcp-binary-port               ${c.TCP_BINARY_PORT}                `);
    console.log(`   --tcp-binary-host               ${c.TCP_BINARY_HOST}                `);
    console.log(`   --tcp-binary-max-clients        ${c.TCP_BINARY_MAX_CLIENTS}         `);
    console.log(`   --tls-binary-enable             ${c.TLS_BINARY_ENABLE}              `);
    console.log(`   --tls-binary-port               ${c.TLS_BINARY_PORT}                `);
    console.log(`   --tls-binary-host               ${c.TLS_BINARY_HOST}                `);
    console.log(`   --tls-binary-max-clients        ${c.TLS_BINARY_MAX_CLIENTS}         `);
    console.log(`   --tcp-jsonrpc-enable            ${c.TCP_JSONRPC_ENABLE}             `);
    console.log(`   --tcp-jsonrpc-port              ${c.TCP_JSONRPC_PORT}               `);
    console.log(`   --tcp-jsonrpc-host              ${c.TCP_JSONRPC_HOST}               `);
    console.log(`   --tcp-jsonrpc-max-clients       ${c.TCP_JSONRPC_MAX_CLIENTS}        `);
    console.log(`   --tls-jsonrpc-enable            ${c.TLS_JSONRPC_ENABLE}             `);
    console.log(`   --tls-jsonrpc-port              ${c.TLS_JSONRPC_PORT}               `);
    console.log(`   --tls-jsonrpc-host              ${c.TLS_JSONRPC_HOST}               `);
    console.log(`   --tls-jsonrpc-max-clients       ${c.TLS_JSONRPC_MAX_CLIENTS}        `);
    console.log(`   --tcp-dinary-enable             ${c.TCP_DINARY_PORTINARY_ENABLE}              `);
    console.log(`   --tcp-dinary-port               ${c.TCP_DINARY_PORT}                `);
    console.log(`   --tcp-dinary-host               ${c.TCP_DINARY_HOST}                `);
    console.log(`   --tcp-dinary-max-clients        ${c.TCP_DINARY_MAX_CLIENTS}         `);
    console.log(`   --tls-dinary-enable             ${c.TLS_DINARY_ENABLE}              `);
    console.log(`   --tls-dinary-port               ${c.TLS_DINARY_PORT}                `);
    console.log(`   --tls-dinary-host               ${c.TLS_DINARY_HOST}                `);
    console.log(`   --tls-dinary-max-clients        ${c.TLS_DINARY_MAX_CLIENTS}         `);
    console.log(`   --dir                           ${c.SLOKI_DIR}                      `);
    console.log(`   --show-ops-interval             ${c.SHOW_OPS_INTERVAL}              `);
    console.log(`   --gc-interval                   ${c.GC_INTERVAL}                    `);
    console.log(`   --mem-limit                     ${c.MEM_LIMIT} Mb                   `);
    console.log('-----------------------------------------------------------------------');
    console.log('Examples:                                                              ');
    console.log('$ sloki     # will use defaults                                        ');
    console.log('$ sloki --tcp-binary-port=6370 --tcp-binary-host=localhost             ');
    console.log();
    process.exit();
}

/***********************************************************************
 * c override: env var, then cmd line option
 ***********************************************************************/

for (const t of transports) {
    for (const e of protocols) {
        for (const o of opts) {
            const v = `${t}_${e}_${o}`;
            const l = v.toLowerCase().replace(/\_/g, '-');
            if (process.env[`SLOKI_${v}`] != undefined) {
                c[v] = process.env[`SLOKI_${v}`];
            } else if (argv[l] != undefined) {
                c[v] = argv[l];
            }
        }
    }
}

c.SLOKI_DIR = process.env.SLOKI_DIR || argv['dir'] || c.SLOKI_DIR;
c.SHOW_OPS_INTERVAL = parseInt(process.env.SLOKI_SHOW_OPS_INTERVAL || argv['show-ops-interval'] || c.SHOW_OPS_INTERVAL);
c.GC_INTERVAL = parseInt(process.env.SLOKI_GC_INTERVAL || argv['gc-interval'] || c.GC_INTERVAL);
c.MEM_LIMIT = parseInt(process.env.SLOKI_MEM_LIMIT || argv['mem-limit'] || c.MEM_LIMIT);


/********************************
 * integrity checks
 ********************************/
function exitError(msg) {
    console.log(`Error: ${msg}`);
    process.exit(-1);
}

// check enable/disable transport/protocol

for (const t of transports) {
    for (const e of protocols) {
        const v = `${t}_${e}_ENABLE`;
        const o = '--'+v.toLowerCase().replace(/\_/g, '-');
        if (c[v] === 'true') c[v] = true;
        if (c[v] === 'false') c[v] = false;
        if (typeof c[v] != 'boolean') {
            exitError(`Error: SLOKI_${v} or ${o} value should be a boolean (true/false)`);
        }
    }
}

// check ports

const maxPort = 65534;

for (const t of transports) {
    for (const e of protocols) {
        const v = `${t}_${e}_PORT`;
        const o = '--'+v.toLowerCase().replace(/\_/g, '-');
        c[v] = parseInt(c[v]);
        if (isNaN(c[v]) || c[v]<1 || c[v]>maxPort) {
            exitError(`Error: SLOKI_${v} or ${o} value should be a number between 1 and ${maxPort}`);
        }
    }
}

// check max clients

const maxClients = 1024;

for (const t of transports) {
    for (const e of protocols) {
        const v = `${t}_${e}_MAX_CLIENTS`;
        const o = '--'+v.toLowerCase().replace(/\_/g, '-');
        c[v] = parseInt(c[v]);
        if ((isNaN(c[v]) || !c[v]) || (c[v]<1 || c[v]>maxClients)) {
            exitError(`Error: SLOKI_${v} or ${o} value should be a number between 0 and ${maxClients}`);
        }
    }
}

// others

c.SLOKI_DIR = path.resolve(c.SLOKI_DIR);
c.SLOKI_DIR_DBS = path.resolve(c.SLOKI_DIR+'/dbs');

if (isNaN(c.GC_INTERVAL) || !c.GC_INTERVAL) {
    exitError('SLOKI_GC_INTERVAL or --gc-interval value should be a number (milliseconds)');
}

if (isNaN(c.MEM_LIMIT) || !c.MEM_LIMIT) {
    exitError('SLOKI_MEM_LIMIT or --mem-limit value should be in MegaBytes, and > 0');
}

c.getMaxClients = function(protocol) {
    switch (protocol) {
    case 'tcp': return c.TCP_BINARY_MAX_CLIENTS;
    case 'tls': return c.TLS_BINARY_MAX_CLIENTS;
    case 'binary': return c.TCP_BINARY_MAX_CLIENTS;
    case 'binarys': return c.TLS_BINARY_MAX_CLIENTS;
    case 'jsonrpc': return c.TCP_JSONRPC_MAX_CLIENTS;
    case 'jsonrpcs': return c.TLS_JSONRPC_MAX_CLIENTS;
    case 'dinary': return c.TCP_DINARY_MAX_CLIENTS;
    case 'dinarys': return c.TLS_DINARY_MAX_CLIENTS;
    default:throw new Error(`unknow protocol '${protocol}'`);
    }
};

c.setMaxClients = function(protocol, max) {
    switch (protocol) {
    case 'tcp': c.TCP_BINARY_MAX_CLIENTS = max;break;
    case 'tls': c.TLS_BINARY_MAX_CLIENTS = max;break;
    case 'binary': c.TCP_BINARY_MAX_CLIENTS = max;break;
    case 'binarys': c.TLS_BINARY_MAX_CLIENTS = max;break;
    case 'jsonrpc': c.TCP_JSONRPC_MAX_CLIENTS = max;break;
    case 'jsonrpcs': c.TLS_JSONRPC_MAX_CLIENTS = max;break;
    case 'dinary': c.TCP_DINARY_MAX_CLIENTS = max;break;
    case 'dinarys': c.TLS_DINARY_MAX_CLIENTS = max;break;
    default:throw new Error(`unknow protocol '${protocol}'`);
    }
};

module.exports = c;
