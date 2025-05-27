import { Express }   from 'express-serve-static-core';
import RoutesManager from '../express/RoutesManager.js';
import BaseRoutes    from './BaseRoutes.js';
import UserRoutes    from './UserRoutes';


class AdminRoutesManager implements RoutesManager {
    registerOnBackend(backend: Express) {
        BaseRoutes.registerOnBackend(backend);
        UserRoutes.registerOnBackend(backend);
    }
}


export default new AdminRoutesManager();
