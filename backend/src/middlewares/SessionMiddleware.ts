import express     from 'express';
import Session     from '../controllers/Session.js';
import { Express } from 'express-serve-static-core';


class SessionMiddleware {
    registerOnBackend(backend: Express) {
        backend.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.session = new Session();
            req.session.initSession(req).then(() => {
                next();
            });
        });
    }
}


export default new SessionMiddleware();
