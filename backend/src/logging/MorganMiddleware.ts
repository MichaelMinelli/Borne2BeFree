import morgan, { StreamOptions } from 'morgan';
import logger                    from './WinstonLogger.js';


const stream: StreamOptions = {
    write: message => logger.http(message)
};

const skip = () => false;

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream,
    skip
});

export default morganMiddleware;
