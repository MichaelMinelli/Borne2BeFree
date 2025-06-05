import * as process    from 'process';
import { Library }     from '../types/Library';
import { Zone }        from '../types/Zone';
import { UserLibrary } from '../types/UserLibrary';
import * as fs         from 'fs-extra';
import { UserConfig }  from '../types/UserConfig';


class Config {
    public readonly production: boolean;

    public readonly userConfigFilePath: string;

    public readonly logsFolder: string;

    public readonly api: {
        port: number
    };

    public libraries: Array<Library> = [];
    public allIpSet: Set<string> = new Set<string>();

    constructor() {
        this.production = process.env.NODE_ENV === 'production';

        this.userConfigFilePath = process.env.USER_CONFIG_FILE_PATH ?? `${ __dirname }/../config.json`;

        this.logsFolder = process.env.LOGS_FOLDER ?? 'logs';

        this.api = {
            port: Number(process.env.API_PORT || 30992)
        };
    }

    async loadUserConfig() {
        const userConfigFile: UserConfig = await fs.readJson(this.userConfigFilePath) as UserConfig;

        this.libraries = userConfigFile.zones.flatMap((zone: Zone) => {
            return zone.libraries.map((library: UserLibrary) => {
                return {
                    ...zone, ...library
                };
            });
        });

        this.libraries = this.libraries.map((library: Library) => {
            // If library.apiKey is not a path (contain no '/'), assume that it is the name of a Docker secret
            const path = library.apiKey.includes('/') ? library.apiKey : `/run/secrets/${ library.apiKey }`;
            library.apiKey = fs.readFileSync(path, 'utf8');
            return library;
        });
    }
}


export default new Config();
