import { baseUrl }       from './apiConstants.js';
import type { AlmaUser } from '../types/AlmaUser.ts';
import type { User }     from '../types/User.ts';


const getUrl = (userBarcode: string): string => `${ baseUrl }/users/${ userBarcode }`;


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
        const user: AlmaUser = await userResponse.json();

        const firstName: string = user.pref_first_name || user.first_name;
        const lastName: string = user.pref_last_name || user.last_name;

        return {
            name    : `${ firstName } ${ lastName }`,
            loans   : user.loans.value,
            requests: user.requests.value,
            fines   : user.fees.value,
            id      : user.primary_id
        };
    } catch ( error ) {
        console.error('Failed to login', error);
        return {
            failureMessage: 'Could not log in. Please try again or ask for help at the circulation desk.'
        };
    }
}

export default login;