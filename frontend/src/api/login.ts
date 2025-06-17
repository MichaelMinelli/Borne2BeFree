import { buildLibraryUrl } from './apiConstants.js';
import type { User }       from '../types/User.ts';


const getUrl = (userBarcode: string): string => buildLibraryUrl(`users/${ userBarcode }`);


interface LoginFailure {
    failureMessage: string;
}


type LoginResult = User | LoginFailure;

async function login(userBarcode: string): Promise<LoginResult> {
    if ( !userBarcode ) {
        return { failureMessage: 'Please enter a barcode number to login.' };
    }

    try {
        const userResponse = await fetch(getUrl(userBarcode));
        return await userResponse.json();
    } catch ( error ) {
        console.error('Failed to login', error);
        return {
            failureMessage: 'Could not log in. Please try again or ask for help at the circulation desk.'
        };
    }
}

export default login;