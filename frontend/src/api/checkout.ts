import { baseUrl }   from './apiConstants.js';
import type { Book } from '../types/Book.ts';


interface CheckoutFailure {
    failureMessage: string;
}


type CheckoutResult = Book | CheckoutFailure;

const getUrl = (bookBarcode: string, userId: string): string => `${ baseUrl }/users/${ userId }/loans?item_barcode=${ bookBarcode }`;

function formatDueDate(dateString: string): string {
    const date = new Date(dateString);
    return Intl.DateTimeFormat('en-US', {
        day  : 'numeric',
        month: 'long',
        year : 'numeric'
    }).format(date);
}

async function checkout(bookBarcode: string, userId: string): Promise<CheckoutResult> {
    if ( !bookBarcode ) {
        return {
            failureMessage: 'Please enter a book barcode to checkout.'
        };
    }

    try {
        const response = await fetch(getUrl(bookBarcode, userId));
        const data = await response.json();

        if ( 'error' in data && data.error ) {
            return {
                failureMessage: `${ data.error }. Please see the circulation desk for more information.`
            };
        }

        return {
            barcode   : bookBarcode,
            bookString: data.title,
            dueDate   : formatDueDate(data.due_date)
        };
    } catch ( error ) {
        console.error('Failed to loan book', error);
        return {
            failureMessage: 'Could not checkout book. Please try again or ask for help at the circulation desk.'
        };
    }
}

export default checkout;