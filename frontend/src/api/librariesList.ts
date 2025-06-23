import { buildLibraryUrl }    from './apiConstants.js';
import type { LibraryResume } from '../types/Library.ts';


async function libraryList(): Promise<Array<LibraryResume> | undefined> {
    try {
        const response = await fetch(buildLibraryUrl(`libraries`));

        return (await response.json() as Array<LibraryResume>).sort((a, b) => {
            if ( a.name < b.name ) {
                return -1;
            } else if ( a.name > b.name ) {
                return 1;
            }
            return 0;
        });
    } catch ( error ) {
        console.log('An error occurred while connecting to our server:\n--\n', error);
        return undefined;
    }
}

export default libraryList;