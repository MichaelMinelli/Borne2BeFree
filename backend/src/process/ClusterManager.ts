import cluster, { Worker } from 'node:cluster';
import WorkerRole          from './WorkerRole.js';
import os                  from 'os';
import ClusterStrategy     from './ClusterStrategy.js';
import WorkerPool          from './WorkerPool.js';
import logger              from '../logging/WinstonLogger.js';


/*
 This class create a cluster of workers by following the strategy (array of WorkerPool) given in the constructor.
 */
class ClusterManager {
    public static readonly CORES = os.cpus().length;
    private readonly primaryFunction: () => void;
    private readonly strategy: ClusterStrategy;

    private workers: { [pid: number]: WorkerRole; } = [];

    constructor(primaryFunction: () => void, strategy: ClusterStrategy) {
        this.primaryFunction = primaryFunction;
        this.strategy = strategy;
    }

    run() {
        if ( cluster.isPrimary ) {
            this.runPrimary();
        } else {
            this.runWorker();
        }
    }

    private getWorkerPool(role: WorkerRole): WorkerPool | undefined {
        return this.strategy.find(elem => elem.role === role);
    }

    private runPrimary() {
        logger.info(`###################################################################### Begin Primary Process`);

        logger.info(`#`);
        logger.info(`# Primary function logs:`);
        this.primaryFunction();
        logger.info(`#`);

        logger.info(`# Number of cores: ${ ClusterManager.CORES }`);
        logger.info(`# Primary process is running`);
        logger.info(`#`);

        logger.info(`###################################################################### End Primary Process`);

        this.strategy.forEach(workerPool => {
            for ( let i = 0 ; i < workerPool.quantity ; i += 1 ) {
                const worker = cluster.fork({ role: workerPool.role });
                if ( worker.process.pid ) {
                    this.workers[worker.process.pid] = workerPool.role;
                }
            }
        });

        // Listen for dying workers and restart them
        cluster.on('exit', (worker: Worker, code: number) => {
            logger.info(`Worker ${ worker.process.pid } exited with code ${ code }`);

            if ( worker.process.pid ) {
                const workerRole = this.workers[worker.process.pid];

                const workerPool = this.getWorkerPool(workerRole);
                if ( workerPool && workerPool.restartOnFail ) {
                    const newWorker = cluster.fork({ role: workerRole });

                    if ( newWorker.process.pid ) {
                        this.workers[newWorker.process.pid] = workerPool.role;
                    }
                }

                delete this.workers[worker.process.pid];
            }
        });
    }

    private runWorker() {
        const workerRole = Number(process.env['role']);

        const workerPool = this.getWorkerPool(workerRole);
        if ( workerPool ) {
            workerPool.loadTask().run();
        } else {
            logger.warn(`Process task not found for role ${ workerRole }`);
        }
    }
}


export default ClusterManager;
