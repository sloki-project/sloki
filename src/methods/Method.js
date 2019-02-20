const log = require('evillogger')({ ns:'Method' });
const shared = require('./shared');
const config = require('../config');

function triggerError(msg, callback) {
    callback({ code:shared.ERROR_CODE_PARAMETER, message:msg });
    if (config.TCP_ENGINE!='binary') {
        log.warn(msg);
    }
}

function triggerErrorInternal(msg, callback) {
    callback({ code:shared.ERROR_CODE_INTERNAL, message:msg });
    if (config.TCP_ENGINE!='binary') {
        log.warn(msg);
    }
}

function Command(descriptor, handler) {

    let descriptorPropertiesCount = 0;
    if (descriptor.properties) {
        descriptorPropertiesCount = Object.keys(descriptor.properties).length;
    }

    if (!descriptor.required) {
        descriptor.required = [];
    }

    if (!descriptor.oneOf) {
        descriptor.oneOf = [];
    }

    function unwantedProperties(params) {
        if (
            params
            && Object.keys(params).length>0
            && (!descriptor.properties || !Object.keys(descriptor.properties).length)
        ) {
            return true;
        }
        return false;
    }

    function handle(params, scope, callback) {

        if (!callback) {
            callback = scope;
            scope = this;
        }

        if (!params) params = {};

        if (descriptor.title.match(/insert|update/)) {
            if (config.MEM_LIMIT_REACHED) {
                triggerErrorInternal(`method "${descriptor.title}": memory limit reached`, callback);
                return;
            }
        }

        // request has parameters, but the descriptor don't have
        if (unwantedProperties(params)) {
            triggerError(`method "${descriptor.title}" does NOT wait for any property`, callback);
            return;
        }

        const paramsCount = Object.keys(params).length;

        // request has no parameters, as specified in the descriptor
        if (descriptorPropertiesCount === 0 && paramsCount === 0) {
            handler(params, scope, callback);
            return;
        }

        // request has more parameters than expected in the descriptor
        if (paramsCount>descriptorPropertiesCount) {
            triggerError(`method "${descriptor.title}": too many properties, expected ${descriptorPropertiesCount}, find ${paramsCount}`, callback);
            return;
        }

        let property;
        for (const prop in descriptor.properties) {
            property = descriptor.properties[prop];
            if (property.alias && property.alias.length) {
                for (const alias of property.alias) {
                    if (params[alias] != undefined) {
                        params[prop] = params[alias];
                        delete params[alias];
                    }
                }
            }
        }

        for (const prop in descriptor.properties) {

            property = descriptor.properties[prop];

            // a mandatory property is missing
            if (descriptor.required.indexOf(prop)>=0 && params[prop] === undefined) {
                if (property.alias) {
                    triggerError(`method "${descriptor.title}": property ${prop} (alias ${property.alias}) is mandatory`, callback);
                } else {
                    triggerError(`method "${descriptor.title}": property ${prop} is mandatory`, callback);
                }
                return;
            }

            // non mandatory property
            if (params[prop] === undefined) {
                continue;
            }

            // check type
            if (property.type != typeof params[prop]) {
                triggerError(`method "${descriptor.title}": property "${prop}" should be a ${property.type}, found ${typeof params[prop]}`, callback);
                return;
            }

            if (property.type === 'string') {
                if (property.pattern) {
                    // patternRe is the compiled version of the regexp, see _compileDescriptorParametersRegexp
                    if (!property.patternRe.test(params[prop])) {
                        triggerError(`method "${descriptor.title}": property "${prop}" does not match regular expression ${property.pattern}`, callback);
                        return;
                    }
                }
            }

            if (property.type === 'number') {
                // greater than
                if (typeof property.minimum === 'number' && params[prop]<property.minimum) {
                    triggerError(`method "${descriptor.title}": property "${prop}" should be > ${property.minimum}`, callback);
                    return;
                }
                // lower than
                if (typeof property.maximum === 'number' && params[prop]>property.maximum) {
                    triggerError(`method "${descriptor.title}": property "${prop}" should be < ${property.maximum}`, callback);
                    return;
                }
            }
        }

        if (descriptor.oneOf.length) {
            let oneOfMatch = false;
            let multipleOneOfFound = false;
            let oneOfStr = [];
            let strs = [];

            for (const oneof of descriptor.oneOf) {
                let found = 0;
                for (const requiredProperty of oneof.required) {
                    strs.push(requiredProperty);
                    if (params[requiredProperty] != undefined) {
                        found++;
                    }
                }
                if (found === descriptor.oneOf.length) {
                    if (!oneOfMatch) {
                        oneOfMatch = true;
                    } else {
                        multipleOneOfFound = true;
                    }
                }
                oneOfStr.push(strs.join(', '));
                strs = [];
            }

            oneOfStr = oneOfStr.join('" OR "');

            if (multipleOneOfFound) {
                triggerError(`method "${descriptor.title}": mandatory properties conflict, please specify properties "${oneOfStr}"`, callback);
                return;
            }

            if (!oneOfMatch) {
                triggerError(`method "${descriptor.title}": mandatory properties are missing (at least "${oneOfStr}")`, callback);
                return;
            }
        }

        //
        // Sanity Check passed successfully
        //


        if (params.nr) {
            // if "nr" (like "no response") passed in params, override callback with an empty one
            callback = () => {};
        }

        handler(params, scope, callback);

    }

    function getDescriptor() {
        return descriptor;
    }

    function _compileDescriptorParametersRegexp() {

        if (!descriptorPropertiesCount) {
            return;
        }

        for (const prop in descriptor.properties) {
            if (descriptor.properties[prop].pattern) {
                descriptor.properties[prop].patternRe = new RegExp(
                    descriptor.properties[prop].pattern,
                    descriptor.properties[prop].patternFlag||''
                );
            }
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
