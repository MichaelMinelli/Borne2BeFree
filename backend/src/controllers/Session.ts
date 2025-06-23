import express         from 'express';
import { Library }     from '../types/Library';
import * as jwt        from 'jsonwebtoken';
import { JwtPayload }  from 'jsonwebtoken';
import Config          from '../config/Config';
import { StatusCodes } from 'http-status-codes';
import logger          from '../logging/WinstonLogger.js';


class Session {
    private _library?: Library = undefined;

    get profile(): Library | undefined {
        return this._library;
    }

    set profile(newProfile: Library | undefined) {
        this._library = newProfile;
    }

    async initSession(req: express.Request, res: express.Response) {
        const authorization = req.headers.authorization;
        if ( authorization && authorization.startsWith('Bearer ') ) {
            const jwtToken = authorization.replace('Bearer ', '');

            try {
                const jwtData = jwt.verify(jwtToken, Config.jwtSecret) as JwtPayload;

                if ( jwtData ) {
                    this.profile = Config.libraries[(jwtData.profile.id as string)];
                }
            } catch ( error ) {
                logger.error(`Error verifying JWT token: ${ JSON.stringify(error) }`);
                res.sendStatus(StatusCodes.UNAUTHORIZED).end();
            }
        }
    }

    /*
     Send a response to the client
     Information: Data could be a promise or an object. If it's a promise, we wait on the data to be resolved before sending the response
     */
    sendResponse(res: express.Response | undefined, code: number, data?: unknown) {
        if ( res ) {
            Promise.resolve(data).then((toReturn: unknown) => {
                res.status(code).json(toReturn);
            });
        }
    }
}


export default Session;
