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
        const libraryCode = req.query.library as string | undefined;

        if ( libraryCode ) {
            this.profile = Config.libraries.find((location: Library) => location.code === libraryCode);
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
