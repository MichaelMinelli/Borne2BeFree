import { Library } from './Library';


interface UserConfig {
    hostname: string;
    apiKey: string;
    libraries: Array<Library>;
};

export type { UserConfig };
