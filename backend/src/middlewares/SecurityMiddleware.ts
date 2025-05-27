import express         from 'express';
import { StatusCodes } from 'http-status-codes';


class SecurityMiddleware {
    check(checkIfConnected: boolean): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if ( !this.checkIfConnected(checkIfConnected, req) ) {
                return req.session.sendResponse(res, StatusCodes.UNAUTHORIZED);
            }

            return next();
        };
    }

    private checkIfConnected(checkIfConnected: boolean, req: express.Request): boolean {
        return !checkIfConnected || (req.session.profile !== null && req.session.profile !== undefined);
    }
}


export default new SecurityMiddleware();
