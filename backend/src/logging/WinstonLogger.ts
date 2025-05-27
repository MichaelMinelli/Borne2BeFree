import winston        from 'winston';
import Config         from '../config/Config';
import * as Transport from 'winston-transport';


const levels = {
    error: 0,
    warn : 1,
    info : 2,
    http : 3,
    debug: 4
};

const colors = {
    error: 'red',
    warn : 'orange',
    info : 'green',
    http : 'magenta',
    debug: 'blue'
};
winston.addColors(colors);

const format = winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format(info => ({
    ...info,
    level: info.level.toUpperCase()
}))(), Config.production ? winston.format.uncolorize() : winston.format.colorize({ all: true }), winston.format.prettyPrint(), winston.format.errors({ stack: true }), winston.format.align(), winston.format.printf(info => {
    const metadata = info.metadata ? `\n${ JSON.stringify(info.metadata) }` : '';
    const stack = info.stack ? `\n${ JSON.stringify(info.stack, undefined, 4) }` : '';
    return `[${ info.timestamp }] (${ process.pid }) ${ info.level } ${ info.message } ${ metadata } ${ stack } `;
}));

const commonTransportOptions = {
    handleRejections: true,
    handleExceptions: true
};

let transports: Array<Transport> = [ new winston.transports.Console({
                                                                        ...commonTransportOptions,
                                                                        level: 'debug'
                                                                    }) ];

if ( Config.production ) {
    const commonFileOptions = {
        ...commonTransportOptions,
        maxsize : 5242880, // 5MB
        maxFiles: 100,
        tailable: true
    };

    transports = transports.concat([ new winston.transports.File({
                                                                     ...commonFileOptions,
                                                                     filename: `${ Config.logsFolder }/error.log`,
                                                                     level   : 'error'
                                                                 }), new winston.transports.File({
                                                                                                     ...commonFileOptions,
                                                                                                     filename: `${ Config.logsFolder }/all.log`,
                                                                                                     level   : 'debug'
                                                                                                 }) ]);
}

const WinstonLogger = winston.createLogger({
                                               levels,
                                               format,
                                               transports,
                                               exitOnError: false
                                           });

export default WinstonLogger;
