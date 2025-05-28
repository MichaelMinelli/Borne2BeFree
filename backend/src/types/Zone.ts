import { UserLibrary } from './UserLibrary';


interface Zone {
    name: string;
    hostname: string;
    apiKey: string;
    libraries: Array<UserLibrary>;
}


export type { Zone };