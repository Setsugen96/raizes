import swaggerJSDoc from "swagger-jsdoc"


const opcoesSwagger = {
    
    definition: {
        openapi : '3.0.0',

        info: {
            title: 'Raízes do Nordeste API',
            version: '1.0.0',
            description: 'Documentação da API REST Raízes do Nordeste.'
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },

    apis: ['./src/route/*.js']
}


const swaggerSpec = swaggerJSDoc(opcoesSwagger)

export default swaggerSpec