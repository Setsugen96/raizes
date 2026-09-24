import {Router} from 'express'
import ProdutoController from '../controller/produtoController.js'

const ProdutoRota = Router()

// POST 
ProdutoRota.post('/produtos', ProdutoController.store)

// GETS 
ProdutoRota.get('/produtos/:id', ProdutoController.show)
ProdutoRota.get('/produtos', ProdutoController.index)

//PUT
ProdutoRota.put('/produtos/:id', ProdutoController.update)

// DELETE
ProdutoRota.delete('/produtos/:id', ProdutoController.delete)

export default ProdutoRota