import { Express }                 from 'express-serve-static-core';
import express, { RequestHandler } from 'express';
import { StatusCodes }             from 'http-status-codes';
import RoutesManager               from '../express/RoutesManager.js';


class BaseRoutes implements RoutesManager {
    registerOnBackend(backend: Express) {
        backend.get('/', this.homepage.bind(this) as RequestHandler);
        backend.get('/health_check', this.healthCheck.bind(this) as RequestHandler);
    }

    private async homepage(req: express.Request, res: express.Response) {
        return req.session.sendResponse(res, StatusCodes.OK);
    }

    private async healthCheck(req: express.Request, res: express.Response) {
        return req.session.sendResponse(res, StatusCodes.OK);
    }
}


export default new BaseRoutes();
