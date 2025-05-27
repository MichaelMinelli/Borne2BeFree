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
            return req.session.sendResponse(res, StatusCodes.OK, {
                error  : 'Sorry, we could not find a circulation desk for your ip address.',
                message: `Could not find your ip (${ req.ip }) in permitIpAddresses for any location`
            });
        }

        return req.session.sendResponse(res, StatusCodes.OK, {
            logo            : req.session.profile.libraryLogoUrl,
            featureImage    : req.session.profile.featureImageUrl,
            name            : req.session.profile.apiLibraryName,
            organizationName: req.session.profile.organizationNameString
        });
    }

    private async getUser(req: express.Request, res: express.Response) {
        logger.info(`Retrieving user with id ${ req.params.userId }.`);

        const user = await AlmaHelper.getUser(req.params.userId);
        if ( !user ) {
            return req.session.sendResponse(res, StatusCodes.OK, { error: 'something went wrong with the lookup' });
        }

        logger.info(JSON.stringify(user));

        req.session.sendResponse(res, StatusCodes.OK, user);
    }

    private async requestLoan(req: express.Request, res: express.Response) {
        logger.info(req.query.item_barcode);
        logger.info(req.body);

        logger.info(`Loan processing started ${ JSON.stringify(req.params) } and ${ JSON.stringify(req.query) } and ${ JSON.stringify(req.body) }`);

        const loan = await AlmaHelper.requestLoan(req.session.profile!, req.params.userId, req.query.item_barcode as string);
        logger.info(loan);

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
