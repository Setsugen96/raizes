import PedidoService from "../service/PedidoService.js";



class PedidoController {
    
    async store(req, res) {

        try {

            const novoPedido = {...req.body, cliente_id: req.usuario.id}
            const pedido = await PedidoService.cadastrar(novoPedido)
            return res.status(201).json({
                message: "Pedido Registrado com sucesso.",
                pedido: pedido
            })

        } catch (error) {

            if(error.name === "ErroValidacao") {
                return res.status(400).json({
                    message: error.message
                })
            }

            return res.status(500).json({
                message: error.message
            })
        }      
    }

    async show(req, res) {

        try {

            const id = req.params.id
            const pedidoEncontrado = await PedidoService.buscarPorId(id)
            
            if(pedidoEncontrado) {

                return res.status(200).json({
                    message: "Pedido encontrado com sucesso",
                    pedido: pedidoEncontrado
                })
            }

            return res.status(404).json({
                message: "Pedido não encontrado."
            })
        } catch (error) {
            
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async index(req, res) {

        try {

            const page = req.query.page 
            const limit = req.query.limit 
            const cliente_id = req.query.cliente_id
            const loja_id = req.query.loja_id 
            const canal_pedido = req.query.canal_pedido
            const status_pedido = req.query.status_pedido

            const pedidos = await PedidoService.listar(page, limit, cliente_id, loja_id, canal_pedido, status_pedido)
            res.status(200).json(pedidos)

        } catch (error) {

            if(error.name === "ErroValidacao") {
                return res.status(400).json({
                    message: error.message
                })
            }

            return res.status(500).json({
                message: error.message
            })
        }
    }

    async update(req, res) {

        try {

            const id = req.params.id
            const novosDados = req.body 

            const pedidoAtualizado = await PedidoService.alterar(id, novosDados)

            if(!pedidoAtualizado) {
                return res.status(404).json({
                    message: "Pedido não encontrado"
                })
            }

            if(pedidoAtualizado.affectedRows > 0) {
                return res.status(200).json({
                    message: "Cardápio alterado com sucesso"
                })
            }

        } catch (error) {

            if(error.name == "ErroValidacao") {
                return res.status(400).json({
                    message: error.message
                })
            }

            return res.status(500).json({
                message: error.message
            })
        }
    }


    async delete(req, res) {
            
            try {
    
                const id = req.params.id
                const pedidoDeletado = await PedidoService.deletar(id)
            
                if(pedidoDeletado.affectedRows > 0) {
    
                    return res.status(200).json({
                    message: "Pedido deletado com sucesso",
                    pedido: pedidoDeletado
                    })
                } 
    
                return res.status(404).json({
                    message: "Pedido não foi encontrado para deletar."
                })
                
                
            } catch (error) {
                return res.status(500).json({
                    message: error.message
                })
            }            
        }
}

export default new PedidoController()