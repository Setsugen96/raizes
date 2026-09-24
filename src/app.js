import express from 'express'
import LojaRota from './route/lojaRoute.js'
import ProdutoRota from './route/produtoRoutes.js'
import CardapioRota from './route/cardapioRoutes.js'
const app = express()

app.use(express.json())

app.use(LojaRota)
app.use(ProdutoRota)
app.use(CardapioRota)
export default app 
