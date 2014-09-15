(function () {
    //use strict;

    var loggerfactory = (function () {


        var traceEnabled,
            debugEnabled,
            infoEnabled,
            warnEnabled,
            errorEnabled = false;

        function setLevel(level) {
            switch (level) {
                case 'trace':
                    traceEnabled = debugEnabled = infoEnabled = warnEnabled = errorEnabled = true;
                    break;
                case 'debug':
                    traceEnabled = false;
                    debugEnabled = infoEnabled = warnEnabled = errorEnabled = true;
                    break;
                case 'info':
                    traceEnabled = debugEnabled = false;
                    infoEnabled = warnEnabled = errorEnabled = true;
                    break;
                case 'warn':
                    traceEnabled = debugEnabled = infoEnabled = false;
                    warnEnabled = errorEnabled = true;
                    break;
                case 'error':
                    traceEnabled = debugEnabled = infoEnabled = warnEnabled = false;
                    errorEnabled = true;
                    break;
                case 'disabled':
                    traceEnabled = debugEnabled = infoEnabled = warnEnabled = errorEnabled = false;
                    break;
            }
        }

        function _getLineNumber() {
            try {
                var stack = new Error().stack.split('\n');
                for (var i = 0; i < stack.length; i++) {
                    var match = stack[i].match(/^.*http:\/\/[a-z:0-9]+\/([a-z:0-9\/.]+).*$/);
                    if (match && match.length >= 2) {
                        var line = match[1].split(':');
                        if (line[0] !== 'scripts/helper/loggerfactory.js') {
                            return line[1];
                        }
                    }
                }
            } catch (e) {
                return 0;
            }
        }

        function isTraceEnabled() {
            return traceEnabled;
        }

        function isDebugEnabled() {
            return debugEnabled;
        }

        function createLogger(path) {

            function formatLog(stringLevel, log) {
                return new Date().toLocaleString()+ ' ' + stringLevel + ' ' + path + ':' + _getLineNumber() + ' : ' + log;
            }

            function log(level, logtext) {
                if (typeof(console) !== 'undefined' && typeof(console.log) !== 'undefined') {
                    switch (level) {
                        case 'trace':
                            console.log('%c ' + formatLog('TRACE', logtext), 'color: #666');
                            break;
                        case 'debug':
                            console.log('%c ' + formatLog('DEBUG', logtext), 'color: #333');
                            break;
                        case 'info':
                            console.log('%c ' + formatLog('INFO', logtext), 'color: #4BC06C');
                            break;
                        case 'warn':
                            console.log('%c ' + formatLog('WARN', logtext), 'color: #F1CB31');
                            break;
                        case 'error':
                            console.log('%c ' + formatLog('ERROR', logtext), 'color: #E61717');
                            break;
                    }
                }
            }

            function extractParameters(l, args) {
                var portions = l.split(/{}/);
                //portions iterator
                var i = 0;
                //args iterator
                var j = 1;

                var result = '';
                while (portions.length > i || args.length > j) {
                    if (portions.length > i) {
                        result += portions[i];
                        i++;
                    }
                    if (args.length > j) {
                        try {
                            result += JSON.stringify(args[j]);
                        } catch (e) {
                            result += args[j];
                        }
                        j++;
                    }
                }
                return result;
            }

            return (function () {
                function trace(l) {
                    if (traceEnabled) {
                        log('trace', extractParameters(l, arguments));
                    }
                }

                function debug(l) {
                    if (debugEnabled) {
                        log('debug', extractParameters(l, arguments));
                    }
                }

                function info(l) {
                    if (infoEnabled) {
                        log('info', extractParameters(l, arguments));
                    }
                }

                function warn(l) {
                    if (warnEnabled) {
                        log('warn', extractParameters(l, arguments));
                    }
                }

                function error(l) {
                    if (errorEnabled) {
                        log('error', extractParameters(l, arguments));
                    }
                }

                return {
                    'trace': trace,
                    'debug': debug,
                    'info': info,
                    'warn': warn,
                    'error': error
                };
            })();
        }
    })();

    /************************************
     Exposing LoggerFactory
     ************************************/


    if (typeof define === 'function' && define.amd) {
        define('loggerfactory', function (require, exports, module) {
            if (!module.config || !module.config() || module.config().noGlobal !== true) {
                window.loggerfactory = loggerfactory;
            }

            return loggerfactory;
        });
    } else {
        window.loggerfactory = loggerfactory;
    }

}).call(this);
