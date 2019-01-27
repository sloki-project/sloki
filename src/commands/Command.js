// http://jsonrpc.org/spec.html#error_object
const ERROR_CODE_PARAMETER = -32602;

function Command(descriptor, handler) {

    let mandatoryParametersCount = 0;

    function handle(params, callback) {

        //
        // Sanity Checks
        //

        if (!params || !params.length) {
            if (mandatoryParametersCount) {
                callback({
                    code:ERROR_CODE_PARAMETER,
                    message:`Number of parameters for method ${descriptor.name} should be at least ${mandatoryParametersCount}`
                });
                return;
            }

            // "this" is the socket socket if client is TCP/TLS

            console.log(descriptor.name,'good1');
            handler(params, callback, this);
            return;
        }

        if (params.length<mandatoryParametersCount) {
            callback({
                code:ERROR_CODE_PARAMETER,
                message:`Number of parameters for method ${descriptor.name} should be at least ${mandatoryParametersCount}`
            });
            return;
        }


        if (params.length>descriptor.parameters.length) {
            callback({
                code:ERROR_CODE_PARAMETER,
                message:`Number of parameters for method ${descriptor.name} should be lower or equal than ${descriptor.parameters.length}`
            });
            return;
        }

        let parameter;

        for (let i = 0; i< descriptor.parameters.length; i++) {

            parameter = descriptor.parameters[i];

            if (!parameter.sanityCheck) {
                continue;
            }

            if (params[i] != null && params[i] != undefined && typeof params[i] != parameter.sanityCheck.type) {
                callback({
                    code:ERROR_CODE_PARAMETER,
                    message:`Wrong type for parameter '${parameter.name}' : found '${typeof params[i]}', expected '${parameter.sanityCheck.type}'`
                });
                return;
            }

            if (params[i] === null || params[i] === undefined && parameter.mandatory) {
                callback({
                    code:ERROR_CODE_PARAMETER,
                    message:`Parameter '${parameter.name}' is mandatory`
                });
                return;
            }

            if (parameter.sanityCheck.re) {
                // re is a compiled regexp (see _compileDescriptorParametersRegexp)
                if (!parameter.sanityCheck.re.test(params[i])) {
                    if (parameter.sanityCheck.reError) {
                        callback({
                            code:ERROR_CODE_PARAMETER,
                            message:parameter.sanityCheck.reError
                        });
                        return;
                    }

                    callback({
                        code:ERROR_CODE_PARAMETER,
                        message:`Parameter '${parameter.name}' does not match regular expression ${parameter.sanityCheck.reString}`
                    });
                    return;
                }
            }
        }

        //
        // Sanity Check passed successfully
        //
        // "this" is the socket socket if client is TCP/TLS
        console.log(descriptor.name,'good2');
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
    }
}

module.exports = Command;
