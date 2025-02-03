import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { json } from 'body-parser';
import routes from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import config from './config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';

const app = express();
app.use(json());

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000'], // List of allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies, etc.)
};

// Use CORS middleware
app.use(cors(corsOptions));

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for authentication and user management'
        },
        servers: [
            {
                url: `http://localhost:${config.port}/${config.prefix}`,
                description: 'Local server'
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
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'] // Change './routes' to './src/routes'
};



// Initialize Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Add the routes with the base prefix
app.use('/' + config.prefix, routes);

// Add error handling
app.use(errorHandler);

mongoose
    .connect(
        config.databaseUri!,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions
    )
    .then(() => {
        console.log('Connected to Database - Initial Connection');
        app.listen(config.port, () => {
            console.log(`Server is listening on port ${config.port}`);
            console.log(`Swagger Docs available at http://localhost:${config.port}/api-docs`);
        });
    })
    .catch((err) => {
        console.log('Initial Database connection error occurred -', err);
    });
