import WorkerRole from './WorkerRole.js';
import WorkerTask from './WorkerTask.js';


/*
 This interface describe a pool of workers.
 */
interface WorkerPool {
    role: WorkerRole,
    quantity: number,
    restartOnFail: boolean,
    loadTask: () => WorkerTask, //This is a function for lazy load the task (only loaded on function call)
}


export default WorkerPool; 
