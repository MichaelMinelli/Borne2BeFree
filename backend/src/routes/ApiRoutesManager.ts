import { Express }   from 'express-serve-static-core';
import RoutesManager from '../express/RoutesManager.js';
import BaseRoutes    from './BaseRoutes.js';
import UserRoutes    from './UserRoutes';
import LibraryRoutes from './LibraryRoutes';


class AdminRoutesManager implements RoutesManager {
    registerOnBackend(backend: Express) {
        BaseRoutes.registerOnBackend(backend);
        LibraryRoutes.registerOnBackend(backend);
        UserRoutes.registerOnBackend(backend);
    }
}


export default new AdminRoutesManager();
