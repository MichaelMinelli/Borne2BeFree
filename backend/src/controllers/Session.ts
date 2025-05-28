import Config      from '../config/Config.js';
import express     from 'express';
import { Library } from '../types/Library';


class Session {
    private _library?: Library = undefined;

    get profile(): Library | undefined {
        return this._library;
    }

    set profile(newProfile: Library | undefined) {
        this._library = newProfile;
    }

    async initSession(req: express.Request) {
        const ipAddress = req.ip?.split(':').pop();

        if ( ipAddress && Config.allIpSet.has(ipAddress) ) {
            this.profile = Config.libraries.find((location: Library) => location.permitIpAddresses.includes(ipAddress));
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
