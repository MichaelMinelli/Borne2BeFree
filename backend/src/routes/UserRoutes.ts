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
        backend.get('/users/:userId', SecurityMiddleware.check(true), this.getUser.bind(this) as RequestHandler);
        backend.post('/users/:userId/loans', SecurityMiddleware.check(true), this.requestLoan.bind(this) as RequestHandler);
    }

    private async getUser(req: express.Request, res: express.Response) {

        const user = await AlmaHelper.getUser(req.session.profile!, req.params.userId);
        if ( !user ) {
            return req.session.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { error: 'something went wrong with the lookup' });
        }

        logger.info(`[Logging] user with id ${ req.params.userId }.`);


        const maskNames = (str: string): string => str.replace(/^(.{3})(.*)$/, (_: string, first: string, rest: string): string => first + '*'.repeat(rest.length));

        const firstName: string = maskNames(user.pref_first_name || user.first_name || '');
        const lastName: string = maskNames(user.pref_last_name || user.last_name || '');

        req.session.sendResponse(res, StatusCodes.OK, {
            name    : `${ firstName } ${ lastName }`,
            loans   : user.loans.value,
            requests: user.requests.value,
            fines   : user.fees.value,
            id      : user.primary_id
        });
    }

    private async requestLoan(req: express.Request, res: express.Response) {
        logger.info(`Loan processing started ${ JSON.stringify(req.params) } and ${ JSON.stringify(req.query) } and ${ JSON.stringify(req.body) }`);

        const loan = await AlmaHelper.requestLoan(req.session.profile!, req.params.userId, req.query.item_barcode as string);

        if ( loan === undefined ) {
            return req.session.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { error: 'something went wrong with the lookup' });
        } else if ( (loan as Loan).error ) {
            return req.session.sendResponse(res, StatusCodes.OK, { error: (loan as Loan).error![0].errorMessage });
        } else {
            return req.session.sendResponse(res, StatusCodes.OK, loan);
        }
    }
}


export default new UserRoutes();
