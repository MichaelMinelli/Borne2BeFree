import { Express }       from 'express-serve-static-core';
import cors              from 'cors';
import morganMiddleware  from '../logging/MorganMiddleware.js';
import { AddressInfo }   from 'net';
import http              from 'http';
import helmet            from 'helmet';
import express           from 'express';
import WorkerTask        from '../process/WorkerTask.js';
import Config            from '../config/Config.js';
import logger            from '../logging/WinstonLogger.js';
import compression       from 'compression';
import ApiRoutesManager  from '../routes/ApiRoutesManager';
import SessionMiddleware from '../middlewares/SessionMiddleware';


class API implements WorkerTask {
    private readonly backend: Express;
    private server!: http.Server;

    constructor() {
        this.backend = express();
        this.backend.set('trust proxy', true);

        this.initBaseMiddlewares();

        SessionMiddleware.registerOnBackend(this.backend);
        ApiRoutesManager.registerOnBackend(this.backend);
    }

    run() {
        this.server = this.backend.listen(Config.api.port, '0.0.0.0', () => {
            const {
                      port,
                      address
                  } = this.server.address() as AddressInfo;
            logger.info(`Server started on http://${ address }:${ port }`);
        });
    }

    private initBaseMiddlewares() {
        this.backend.use(morganMiddleware); //Log API accesses
        this.backend.use(helmet()); //Help to secure express, https://helmetjs.github.io/
        this.backend.use(cors()); //Allow CORS requests
        this.backend.use(compression()); //Compress responses

        this.backend.use(express.json()); //Parse JSON bodies
    }
}


export default API;
