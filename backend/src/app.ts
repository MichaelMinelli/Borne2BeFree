//
// Dependencies
//
import Config         from './config/Config';
import ClusterManager from './process/ClusterManager';
import WorkerRole     from './process/WorkerRole';
import API            from './express/API';
import { Library }    from './types/Library';


// ensure that the userConfig is loaded and correctly formatted
if ( !Config.userConfig || !Array.isArray(Config.userConfig.libraries) || Config.userConfig.libraries.length === 0 ) {
    throw new Error('userConfig is not correctly formatted or empty');
}

//TODO - ensure that the userConfig has all required fields

// ensure that the venn diagram of ips does not have intersections
{
    const all_ip_array: string[] = Config.userConfig.libraries.flatMap((l: Library) => l.permitIpAddresses);
    Config.allIpSet = new Set(all_ip_array);
    if ( all_ip_array.length !== Config.allIpSet.size ) {
        throw new Error('Multiple libraries are configured with the same ip address but that\'s not allowed');
    }
}

// ensure that circ desks have different names
{
    const circDeskAndLibraryNames_array: string[] = Config.userConfig.libraries.map((l: Library) => l.apiLibraryName + '_' + l.apiCircDesk);
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
