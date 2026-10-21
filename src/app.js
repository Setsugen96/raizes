import express from 'express'
import LojaRota from './route/lojaRoute.js'
import ProdutoRota from './route/produtoRoutes.js'
import CardapioRota from './route/cardapioRoutes.js'
import UsuarioRota from './route/usuarioRoute.js'
import AuthRota from './route/authRoute.js'
import PedidoRota from './route/pedidoRoute.js'
import FidelidadeRota from './route/fidelidadeRoute.js'
const app = express()

app.use(express.json())

app.use(LojaRota)
app.use(ProdutoRota)
app.use(CardapioRota)
app.use(UsuarioRota)
app.use(AuthRota)
app.use(PedidoRota)
app.use(FidelidadeRota)
export default app 
