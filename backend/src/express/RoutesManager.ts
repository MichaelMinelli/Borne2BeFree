import { Express } from 'express-serve-static-core';


interface RoutesManager {
    registerOnBackend(backend: Express): void;
}


export default RoutesManager;
