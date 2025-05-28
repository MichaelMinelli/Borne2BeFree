import * as process    from 'process';
import userConfigFile  from '../config.js';
import { Library }     from '../types/Library';
import { Zone }        from '../types/Zone';
import { UserLibrary } from '../types/UserLibrary';


class Config {
    public readonly production: boolean;

    public readonly logsFolder: string;

    public readonly api: {
        port: number
    };

    public readonly libraries: Array<Library>;
    public allIpSet: Set<string> = new Set<string>();

    constructor() {
        this.production = process.env.NODE_ENV === 'production';

        this.logsFolder = process.env.LOGS_FOLDER ?? 'logs';

        this.api = {
            port: Number(process.env.API_PORT || 30992)
        };

        this.libraries = userConfigFile.zones.flatMap((zone: Zone) => {
            return zone.libraries.map((library: UserLibrary) => {
                return {
                    ...zone, ...library
                };
            });
        });
    }
}


export default new Config();
