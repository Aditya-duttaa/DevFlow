import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DevFlow API",
            version: "1.0.0",
            description: "Production-grade project management backend API"
        },
        servers: [
            {
                url: "http://localhost:5000/api"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJSDoc(options);