const log = require('evillogger')({ ns:'Command' });

// http://jsonrpc.org/spec.html#error_object
const ERROR_CODE_PARAMETER = -32602;

function triggerError(msg, callback) {
    callback({ code:ERROR_CODE_PARAMETER, message:msg });
    log.warn(msg);
}

function Command(descriptor, handler) {

    let mandatoryParametersCount = 0;

    function handle(params, callback) {


        //
        // Sanity Checks
        //

        if (!params || !params.length) {
            if (mandatoryParametersCount) {
                triggerError(`${descriptor.name}: number of parameters should be at least ${mandatoryParametersCount}`, callback);
                return;
            }

            // "this" is the socket socket if client is TCP/TLS
            handler(params, callback, this);
            return;
        }

        if (params.length<mandatoryParametersCount) {
            triggerError(`${descriptor.name}: number of parameters should be at least ${mandatoryParametersCount}`, callback);
            return;
        }


        if (params.length>descriptor.parameters.length) {
            if (descriptor.parameters.length>0) {
                triggerError(`${descriptor.name}: number of parameters should be lower or equal than ${descriptor.parameters.length}`, callback);
                return;
            }
            triggerError(`${descriptor.name}: this method does not wait for parameters`, callback);
        }

        let parameter;

        for (let i = 0; i< descriptor.parameters.length; i++) {

            parameter = descriptor.parameters[i];

            if (!parameter.sanityCheck) {
                continue;
            }

            if (
                params[i] != null && params[i] != undefined &&
                (
                    (typeof parameter.sanityCheck.type === 'object' && parameter.sanityCheck.type.indexOf(typeof params[i])<0) ||
                    (typeof parameter.sanityCheck.type === 'string' && typeof params[i] != parameter.sanityCheck.type)
                )
            ) {
                triggerError(`${descriptor.name}: wrong type for parameter '${parameter.name}' : found '${typeof params[i]}', expected '${parameter.sanityCheck.type}'`, callback);
                return;
            }

            if (params[i] === null || params[i] === undefined && parameter.mandatory) {
                triggerError(`${descriptor.name}: parameter '${parameter.name}' is mandatory`, callback);
                return;
            }

            if (parameter.sanityCheck.re) {
                // re is a compiled regexp (see _compileDescriptorParametersRegexp)
                if (!parameter.sanityCheck.re.test(params[i])) {
                    if (parameter.sanityCheck.reError) {
                        triggerError(`${descriptor.name}: ${parameter.sanityCheck.reError}`, callback);
                        return;
                    }

                    triggerError(`${descriptor.name}: parameter '${parameter.name}' does not match regular expression ${parameter.sanityCheck.reString}`, callback);
                    return;
                }
            }
        }

        //
        // Sanity Check passed successfully
        //
        // "this" is the socket socket if client is TCP/TLS
        handler(params, callback, this);

    }

    function getDescriptor() {
        return descriptor;
    }

    function _hasParametersInDescriptor() {
        if (
            !descriptor
            ||
            !descriptor.parameters
            ||
            !descriptor.parameters.length
        ) {
            return false;
        }

        return true;
    }

    function _compileDescriptorParametersRegexp() {

        if (!_hasParametersInDescriptor()) {
            return;
        }

        let parameter;

        for (let i = 0; i< descriptor.parameters.length; i++) {

            parameter = descriptor.parameters[i];

            if (parameter.mandatory) {
                mandatoryParametersCount+=1;
            }

            if (!parameter.sanityCheck) {
                continue;
            }

            parameter.sanityCheck.re = new RegExp(
                parameter.sanityCheck.reString,
                parameter.sanityCheck.reFlag
            );
        }

    }

    // precompile regular expressions
    _compileDescriptorParametersRegexp();

    return {
        handle,
        getDescriptor
    };
}

module.exports = Command;
