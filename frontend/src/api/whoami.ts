import { baseUrl }      from './apiConstants.js';
import type { Library } from '../types/Library.ts';


interface WhoAmIFailureApi {
    error: string;
    message: string;
}


interface WhoAmIFailure {
    failureMessage: string;
}


type WhoAmIResponse = Library | WhoAmIFailureApi;
type WhoAmIResult = Library | WhoAmIFailure;

async function whoami(): Promise<WhoAmIResult> {
    try {
        const response = await fetch(`${ baseUrl }/whoami`);
        const data: WhoAmIResponse = await response.json();

        if ( 'error' in response ) {
            console.log(data);
            return {
                failureMessage: 'Failed to set up circulation desk. The server is probably not correctly configured.'
            };
        }

        return data as Library;
    } catch ( error ) {
        console.log('An error occurred while connecting to our server:\n--\n', error);
        return {
            failureMessage: 'An error occurred while connecting to our server.'
        };
    }
}

export default whoami;