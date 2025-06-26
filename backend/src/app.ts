//
// Dependencies
//
import Config                       from './config/Config';
import ClusterManager               from './process/ClusterManager';
import WorkerRole                   from './process/WorkerRole';
import API                          from './express/API';
import { Library }                  from './types/Library';
import logger                       from './logging/WinstonLogger.js';
import { RateLimiterClusterMaster } from 'rate-limiter-flexible';


(async () => {
    await Config.loadUserConfig(logger);

    // ensure that there is no duplicate library apiName
    {
        const allLibraryCodeArray: string[] = Object.values(Config.libraries).flatMap((l: Library) => l.apiName);

        if ( allLibraryCodeArray.length !== (new Set(allLibraryCodeArray)).size ) {
            throw new Error('Multiple libraries are configured with the same apiName but that\'s not allowed');
        }
    }

    // ensure that circ desks have different names
    {
        const circDeskAndLibraryNames_array: string[] = Object.values(Config.libraries).map((l: Library) => l.apiName + '_' + l.apiCircDesk);
        const circDeskAndLibraryNames_set = new Set(circDeskAndLibraryNames_array);
        if ( circDeskAndLibraryNames_array.length !== circDeskAndLibraryNames_set.size ) {
            throw new Error('Multiple libraries are configured with the same name but that\'s not allowed');
        }
    }

    (new ClusterManager(() => {
        new RateLimiterClusterMaster();
    }, [ {
        role         : WorkerRole.API,
        quantity     : ClusterManager.CORES,
        restartOnFail: true,
        loadTask     : () => new API()
    } ])).run();
})().then();


