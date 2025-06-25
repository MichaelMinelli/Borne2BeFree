import * as process    from 'process';
import { Library }     from '../types/Library';
import { Zone }        from '../types/Zone';
import { UserLibrary } from '../types/UserLibrary';
import * as fs         from 'fs-extra';
import { UserConfig }  from '../types/UserConfig';
import { z }           from 'zod';
import { fromError }   from 'zod-validation-error';
import { Logger }      from 'winston';


class Config {
    public readonly production: boolean;

    public readonly userConfigFilePath: string;

    public readonly logsFolder: string;

    public jwtSecret: string = '';

    public readonly api: {
        port: number
    };

    public libraries: { [apiName: string]: Library } = {};

    constructor() {
        this.production = process.env.NODE_ENV === 'production';

        this.userConfigFilePath = process.env.USER_CONFIG_FILE_PATH ?? `${ __dirname }/../config.json`;

        this.logsFolder = process.env.LOGS_FOLDER ?? 'logs';

        this.api = {
            port: Number(process.env.API_PORT || 30992)
        };
    }

    // The logger is passed as an argument because if we import it we have an infinite dependency loop
    async loadUserConfig(logger: Logger) {
        const userConfigFile: UserConfig = await fs.readJson(this.userConfigFilePath) as UserConfig;

        // Load the JWT secret from a Docker secret if it is not a path
        const path = userConfigFile.jwtSecret.includes('/') ? userConfigFile.jwtSecret : `/run/secrets/${ userConfigFile.jwtSecret }`;
        this.jwtSecret = fs.readFileSync(path, 'utf8');

        // ensure that the configuration is valid
        {
            try {
                UserConfig.parse(userConfigFile);
            } catch ( error ) {
                if ( error instanceof z.ZodError ) {
                    logger.error(`Invalid user configuration file: ${ fromError(error).toString() }`);
                    logger.error('Details:', error);
                    throw new Error(`Invalid user configuration file: ${ fromError(error).toString() }`);
                }
            }
        }

        this.libraries = {};

        userConfigFile.zones.forEach((zone: Zone) => {
            return zone.libraries.forEach((library: UserLibrary) => {
                const result = {
                    ...zone, ...library
                };

                result.logoutTime = library.logoutTime || zone.logoutTime;

                // If library.apiKey is not a path (contain no '/'), assume that it is the name of a Docker secret
                let path = result.apiKey.includes('/') ? result.apiKey : `/run/secrets/${ result.apiKey }`;
                result.apiKey = fs.readFileSync(path, 'utf8');

                // If library.password is not a path (contain no '/'), assume that it is the name of a Docker secret
                path = result.password.includes('/') ? result.password : `/run/secrets/${ result.password }`;
                result.password = fs.readFileSync(path, 'utf8');

                this.libraries[result.apiName] = result;
            });
        });
    }
}


export default new Config();
