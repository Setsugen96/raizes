import {Router} from 'express'
import LojaController from '../controller/lojaController.js'

const LojaRota = Router()

// POST 
LojaRota.post('/lojas', LojaController.store)

// GETS 
LojaRota.get('/lojas/:id', LojaController.show)
LojaRota.get('/lojas', LojaController.index)

//PUT
LojaRota.put('/lojas/:id', LojaController.update)

// DELETE
LojaRota.delete('/lojas/:id', LojaController.delete)

export default LojaRota 