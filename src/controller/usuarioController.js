
import UsuarioService from "../service/UsuarioService.js"


class UsuarioController {

    async store(req, res) {
        
        try {

            const novo_usuario = req.body
            const usuario_cadastrado = await UsuarioService.cadastrar(novo_usuario)

            return res.status(201).json({
                message: "Usuário adicionado com sucesso.",
                usuario: usuario_cadastrado
        })

        } catch (error) {

            if(error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Email já registrado."
                })
            }

            if(error.name === "ErroValidacao") {
                return res.status(400).json({
                    message:error.message 
                })
            }

            return res.status(500).json({
                message:error.message
            })
        }
    
    }

    async storeCliente(req, res) {
        
        try {

            const novo_usuario = req.body
            novo_usuario.role = 'CLIENTE'
            const usuario_cadastrado = await UsuarioService.cadastrar(novo_usuario)

            return res.status(201).json({
                message: "Cliente adicionado com sucesso.",
                usuario: usuario_cadastrado
        })

        } catch (error) {

            if(error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Email já registrado."
                })
            }

            if(error.name === "ErroValidacao") {
                return res.status(400).json({
                    message:error.message 
                })
            }

            return res.status(500).json({
                message:error.message
            })
        }
    
    }

    async show(req, res) {
            
        try {
    
            const id = req.params.id
            const usuarioEncontrado = await UsuarioService.buscarPorId(id)      
            
            return res.status(200).json({
                message: "Usuário encontrado com sucesso",
                usuario: usuarioEncontrado
            })
                    
        } catch (error) {

            if(error.name === "ErroNaoEncontrado") {
                return res.status(404).json({
                    message: error.message
                })
            }

            return res.status(500).json({
                message: error.message
            })
        }            
    }  
    
    async index(req, res) {

        try {

            const page = req.query.page 
            const limit = req.query.limit 
            const role = req.query.role 
            const loja_id = req.query.loja_id

            const usuarios = await UsuarioService.listar(page, limit, role, loja_id)
            res.status(200).json(usuarios)

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
        
        try{
            const id = req.params.id 
            const novosDados = req.body 

            const usuarioAtualizado = await UsuarioService.alterar(id, novosDados)
          
            return res.status(200).json({
                message: "Usuário alterado com sucesso",
                usuarioAtualizado: usuarioAtualizado
            })
            
        } catch(error) {

            if(error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Email já registrado."
                })
            }

            if(error.name === "ErroNaoEncontrado") {
                return res.status(404).json({
                    message: error.message
                })
            }

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
            const usuarioDeletado = await UsuarioService.deletar(id)
  
            return res.status(200).json({
                message: "Usuario deletado com sucesso",
                usuario: usuarioDeletado
            })

        } catch (error) {

            if(error.name === "ErroNaoEncontrado") {
                return res.status(404).json({
                    message: error.message
                })
            }

            return res.status(500).json({
                message: error.message
            })
        }
    }
}

export default new UsuarioController()