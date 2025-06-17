import { Express }                 from 'express-serve-static-core';
import express, { RequestHandler } from 'express';
import { StatusCodes }             from 'http-status-codes';
import RoutesManager               from '../express/RoutesManager.js';
import SecurityMiddleware          from '../middlewares/SecurityMiddleware';
import logger                      from '../logging/WinstonLogger';
import AlmaHelper                  from '../helpers/AlmaHelper';


interface Loan {
    error?: { errorMessage: string }[];

    [key: string]: unknown;
}


class UserRoutes implements RoutesManager {
    registerOnBackend(backend: Express) {
        backend.get('/whoami', SecurityMiddleware.check(false), this.whoami.bind(this) as RequestHandler);
        backend.get('/users/:userId', SecurityMiddleware.check(true), this.getUser.bind(this) as RequestHandler);
        backend.post('/users/:userId/loans', SecurityMiddleware.check(true), this.requestLoan.bind(this) as RequestHandler);
    }

    private async whoami(req: express.Request, res: express.Response) {
        if ( !req.session.profile ) {
            return req.session.sendResponse(res, StatusCodes.NOT_FOUND, {
                error  : 'Sorry, we could not find a circulation desk for your code.',
                message: `Could not find your code (${ req.query.library as string | undefined }) for any location`
            });
        }

        if ( req.session.profile.permitIpAddresses && req.session.profile.permitIpAddresses.length > 0 && req.ip !== undefined && !req.session.profile.permitIpAddresses.includes(req.ip.split(':').pop()!) ) {
            return req.session.sendResponse(res, StatusCodes.NOT_FOUND);
        }

        return req.session.sendResponse(res, StatusCodes.OK, {
            logo            : req.session.profile.logo,
            featureImage    : req.session.profile.featureImage,
            name            : req.session.profile.name,
            organizationName: req.session.profile.organization
        });
    }

    private async getUser(req: express.Request, res: express.Response) {

        const user = await AlmaHelper.getUser(req.session.profile!, req.params.userId);
        if ( !user ) {
            return req.session.sendResponse(res, StatusCodes.OK, { error: 'something went wrong with the lookup' });
        }

        logger.info(`[Logging] user with id ${ req.params.userId }.`);

        req.session.sendResponse(res, StatusCodes.OK, user);
    }

    private async requestLoan(req: express.Request, res: express.Response) {
        logger.info(`Loan processing started ${ JSON.stringify(req.params) } and ${ JSON.stringify(req.query) } and ${ JSON.stringify(req.body) }`);

        const loan = await AlmaHelper.requestLoan(req.session.profile!, req.params.userId, req.query.item_barcode as string);

        if ( loan === undefined ) {
            return req.session.sendResponse(res, StatusCodes.OK, { error: 'something went wrong with the lookup' });
        } else if ( (loan as Loan).error ) {
            return req.session.sendResponse(res, StatusCodes.OK, { error: (loan as Loan).error![0].errorMessage });
        } else {
            return req.session.sendResponse(res, StatusCodes.OK, loan);
        }
    }
}


export default new UserRoutes();
