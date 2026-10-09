import AuthService from "../service/AuthService.js"


class AuthController {

    async login(req, res) {

        try {

            const usuario = req.body
            const usuarioAutenticado = await AuthService.conectar(usuario)

            const token = AuthService.gerarToken(usuarioAutenticado)
            
            return res.status(200).json({
                message: "Usuario conectado",
                usuario: {
                    id: usuarioAutenticado.id ,
                    nome: usuarioAutenticado.nome,
                    role: usuarioAutenticado.role
                },
                
                token: token
            })
            

        } catch (error) {

            if(error.name === "ErroValidacao") {
                return res.status(400).json({
                    message:error.message
                })
            }
            
            return res.status(500).json({
                message: error.message
            })
        }

    }
}

export default new AuthController()