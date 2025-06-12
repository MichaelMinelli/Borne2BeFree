//
// Dependencies
//
import Config         from './config/Config';
import ClusterManager from './process/ClusterManager';
import WorkerRole     from './process/WorkerRole';
import API            from './express/API';
import { Library }    from './types/Library';
import logger         from './logging/WinstonLogger.js';


(async () => {
    await Config.loadUserConfig(logger);

    // ensure that there is no duplicate library codes
    {
        const allLibraryCodeArray: string[] = Config.libraries.flatMap((l: Library) => l.code);

        if ( allLibraryCodeArray.length !== (new Set(allLibraryCodeArray)).size ) {
            throw new Error('Multiple libraries are configured with the same code but that\'s not allowed');
        }
    }

    // ensure that circ desks have different names
    {
        const circDeskAndLibraryNames_array: string[] = Config.libraries.map((l: Library) => l.apiName + '_' + l.apiCircDesk);
        const circDeskAndLibraryNames_set = new Set(circDeskAndLibraryNames_array);
        if ( circDeskAndLibraryNames_array.length !== circDeskAndLibraryNames_set.size ) {
            throw new Error('Multiple libraries are configured with the same name but that\'s not allowed');
        }
    }

    if ( Config.production ) {
        (new ClusterManager([ {
            role         : WorkerRole.API,
            quantity     : ClusterManager.CORES,
            restartOnFail: true,
            loadTask     : () => new API()
        } ])).run();
    } else {
        (new API()).run();
    }
})().then();


