import jwt from 'jsonwebtoken'



class AuthMiddleware {

    autenticarToken(req, res, next) {

        try {

            const authHeader = req.headers.authorization 
            
            if(!authHeader) {
                return res.status(401).json({
                    message: "Token não foi informado"
                })
            }

            const token = authHeader.split(' ')[1]

            const usuario = jwt.verify(token, process.env.JWT_SECRET)
            req.usuario = usuario 
            next()

        } catch (error) {

            return res.status(401).json({
                message: "Token inválido ou expirado"
            })
        }        
    }
}

export default new AuthMiddleware()