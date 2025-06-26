import { buildLibraryUrl } from './apiConstants.js';
import type { User }       from '../types/User.ts';
import type { Library }    from '../types/Library.ts';


const libraryLoginUrl: string = buildLibraryUrl(`libraries/login`);
const getLoginUrl = (userBarcode: string): string => buildLibraryUrl(`users/${ userBarcode }`);


interface LoginFailure {
    failureMessage: string;
    retryAfter?: string;
}


type LibraryLoginResult = Library | LoginFailure;
type LoginResult = User | LoginFailure;

async function libraryLogin(apiName: string, password: string): Promise<LibraryLoginResult> {
    try {
        const libraryResponse = await fetch(libraryLoginUrl, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body   : JSON.stringify({
                                        libraryApiName: apiName,
                                        password
                                    })
        });

        const response = await libraryResponse.json();
        if ( 'error' in response && response.error ) {
            if ( libraryResponse.status === 429 ) {
                return {
                    failureMessage: `Too many requests`,
                    retryAfter    : response.retryAfter
                };
            }

            return {
                failureMessage: `${ response.error }. Please see the circulation desk for more information.`
            };
        }
        return response;
    } catch ( error ) {
        console.error('Failed to login', JSON.stringify(error));
        return {
            failureMessage: 'Could not log in. Please try again or ask for help at the circulation desk.'
        };
    }
}

async function login(library: Library, userBarcode: string): Promise<LoginResult> {
    if ( !userBarcode ) {
        return { failureMessage: 'Please enter a barcode number to login.' };
    }

    try {
        const userResponse = await fetch(getLoginUrl(userBarcode), {
            headers: {
                'Authorization': `Bearer ${ library.token }`
            }
        });

        const response = await userResponse.json();
        if ( 'error' in response && response.error ) {
            return {
                failureMessage: `${ response.error }. Please see the circulation desk for more information.`
            };
        }
        return response;
    } catch ( error ) {
        console.error('Failed to login', error);
        return {
            failureMessage: 'Could not log in. Please try again or ask for help at the circulation desk.'
        };
    }
}

export { libraryLogin, login };