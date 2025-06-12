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
        if ( !checkIfConnected ) {
            return true;
        }

        if ( req.session.profile === null || req.session.profile === undefined ) {
            return false;
        }

        if ( req.session.profile.permitIpAddresses && req.session.profile.permitIpAddresses.length > 0 && req.ip !== undefined ) {
            return req.session.profile.permitIpAddresses.includes(req.ip.split(':').pop()!);
        }

        return true;
    }
}


export default new SecurityMiddleware();
