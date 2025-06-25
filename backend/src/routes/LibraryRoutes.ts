import { Express }                 from 'express-serve-static-core';
import express, { RequestHandler } from 'express';
import { StatusCodes }             from 'http-status-codes';
import RoutesManager               from '../express/RoutesManager.js';
import SecurityMiddleware          from '../middlewares/SecurityMiddleware';
import Config                      from '../config/Config';
import * as jwt                    from 'jsonwebtoken';


class LibraryRoutes implements RoutesManager {
    registerOnBackend(backend: Express) {
        backend.get('/libraries', SecurityMiddleware.check(false), this.getLibraries.bind(this) as RequestHandler);
        backend.post('/libraries/login', SecurityMiddleware.check(false), this.login.bind(this) as RequestHandler);
    }

    private async getLibraries(req: express.Request, res: express.Response) {

        const libraries = Object.values(Config.libraries).map((library) => {
            return {
                name   : library.name,
                apiName: library.apiName
            };
        });

        return req.session.sendResponse(res, StatusCodes.OK, libraries);
    }

    private async login(req: express.Request, res: express.Response) {
        const libraryApiName = req.body.libraryApiName as string | undefined;

        if ( !libraryApiName ) {
            return req.session.sendResponse(res, StatusCodes.BAD_REQUEST);
        }

        if ( !(libraryApiName in Config.libraries) ) {
            return req.session.sendResponse(res, StatusCodes.NOT_FOUND, {
                error  : 'Sorry, we could not find a circulation desk for your code.',
                message: `Could not find your code (${ req.query.library as string | undefined }) for any location`
            });
        }

        const library = Config.libraries[libraryApiName];

        if ( library.permitIpAddresses && library.permitIpAddresses.length > 0 && req.ip !== undefined && !library.permitIpAddresses.includes(req.ip.split(':').pop()!) ) {
            return req.session.sendResponse(res, StatusCodes.UNAUTHORIZED);
        }

        if ( req.body.password !== library.password ) {
            return req.session.sendResponse(res, StatusCodes.UNAUTHORIZED);
        }

        const libraryClientObject = {
            logo            : library.logo,
            featureImage    : library.featureImage,
            name            : library.name,
            currency        : library.currency,
            organizationName: library.organization,
            logoutTime      : library.logoutTime
        };

        return req.session.sendResponse(res, StatusCodes.OK, {
            ...libraryClientObject,
            token: jwt.sign({ profile: { id: library.apiName } }, Config.jwtSecret)
        });
    }
}


export default new LibraryRoutes();
