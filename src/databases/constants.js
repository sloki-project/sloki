const ENV = require('../env');

const ERROR_CODE_PARAMETER = -32602;
const ERROR_CODE_INTERNAL = -32603;

const DEFAULT_DATABASE_OPTIONS =  {
    serializationMethod:"pretty",
    autoload:true,
    autosave:true,
    autosaveInterval:ENV.DATABASES_AUTOSAVE_INTERVAL
}

module.exports = {
    ERROR_CODE_INTERNAL,
    ERROR_CODE_PARAMETER,
    DEFAULT_DATABASE_OPTIONS
}
