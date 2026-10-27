import {Router} from 'express'
import FidelidadeController from '../controller/fidelidadeController.js';
import AuthMiddleware from "../middleware/authMiddleware.js";
import AuthorizationMiddleware from "../middleware/authorizationMiddleware.js";
import authMiddleware from '../middleware/authMiddleware.js';

const FidelidadeRota = Router()


// UPDATE
FidelidadeRota.put('/fidelidade/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE'),  
AuthorizationMiddleware.autorizarFidelidade() ,FidelidadeController.update)

//GETS
FidelidadeRota.get('/fidelidade/:id', AuthMiddleware.autenticarToken, AuthorizationMiddleware.autorizarRoles('ADMINISTRADOR', 'CLIENTE'), 
AuthorizationMiddleware.autorizarFidelidade(), FidelidadeController.show)

export default FidelidadeRota