import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import logger                                    from '../logging/WinstonLogger';
import { Library }                               from '../types/Library';


class AlmaHelper {
    public async getUser(library: Library, id: string): Promise<unknown> {
        const options: AxiosRequestConfig = {
            baseURL: library.hostname,
            url    : '/almaws/v1/users/' + id + '?expand=loans,requests,fees&format=json',
            method : 'get',
            headers: {
                Authorization: `apikey ${ library.apiKey }`
            }
        };

        try {
            const response = await axios.request(options);
            return response.data;
        } catch ( error ) {
            logger.error(error);
            return undefined;
        }
    }

    public async requestLoan(library: Library, userId: string, barcode: string): Promise<unknown> {
        const library_xml = `<?xml version='1.0' encoding='UTF-8'?><item_loan><circ_desk>${ library.apiCircDesk }</circ_desk><library>${ library.apiName }</library></item_loan>`;
        const options: AxiosRequestConfig = {
            baseURL: library.hostname,
            url    : `/almaws/v1/users/${ userId }/loans?user_id_type=all_unique&item_barcode=${ barcode }`,
            data   : library_xml,
            method : 'post',
            headers: {
                'Content-Type' : `application/xml`,
                'Authorization': `apikey ${ library.apiKey }`
            }
        };

        try {
            const response = await axios.request(options);
            return response.data;
        } catch ( error ) {
            const axiosError = error as AxiosError;
            if ( axiosError.response ) {
                logger.error(axiosError.response.data);
                logger.error(`ErrorList ${ JSON.stringify(axiosError.response.data) }`);
                logger.error(axiosError.response.status);
                logger.error(axiosError.response.headers);
            } else if ( axiosError.request ) {
                logger.error(axiosError.request);
            } else {
                logger.error(axiosError.message);
            }
            return undefined;
        }
    }
}


export default new AlmaHelper();