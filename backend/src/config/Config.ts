import * as process   from 'process';
import userConfigFile from '../config.js';
import { UserConfig } from '../types/UserConfig';


class Config {
    public readonly production: boolean;

    public readonly logsFolder: string;

    public readonly api: {
        port: number
    };

    public readonly userConfig: UserConfig;
    public allIpSet: Set<string> = new Set<string>();

    constructor() {
        this.production = process.env.NODE_ENV === 'production';

        this.logsFolder = process.env.LOGS_FOLDER ?? 'logs';

        this.api = {
            port: Number(process.env.API_PORT || 30992)
        };

        this.userConfig = userConfigFile;
    }
}


export default new Config();
