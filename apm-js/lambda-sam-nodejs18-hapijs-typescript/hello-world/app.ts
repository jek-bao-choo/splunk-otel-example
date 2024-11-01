import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Server } from '@hapi/hapi';
import { StaticServePlugin } from './StaticServePlugin';

let server: Server;

async function initServer(): Promise<Server> {
    const server = new Server({
        port: 3000,
        host: 'localhost',
    });

    // Register routes directly in the server for more control
    server.route([
        {
            method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            path: '/',
            handler: () => {
                return {
                    message: 'Root endpoint - WITHOUT lambda layer but with Hapi.js',
                };
            },
        },
        {
            method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            path: '/hello',
            handler: () => {
                return {
                    message: 'Hello endpoint - WITHOUT lambda layer but with Hapi.js',
                };
            },
        },
    ]);

    // Register the plugin for additional routes
    await server.register([new StaticServePlugin()]);

    // Log all registered routes for debugging
    const routes = server.table();
    console.log(
        'Available routes:',
        JSON.stringify(
            routes.map((route) => ({
                path: route.path,
                method: route.method,
            })),
            null,
            2,
        ),
    );

    return server;
}

const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Debug logging
        console.log('Incoming event:', JSON.stringify(event, null, 2));

        // Initialize server if needed
        if (!server) {
            console.log('Initializing server...');
            server = await initServer();
        }

        // Handle path processing
        let path = event.path || '/';

        // Remove stage name if present (case insensitive)
        const stageName = path.split('/')[1]?.toLowerCase();
        if (stageName === 'prod') {
            path = '/' + path.split('/').slice(2).join('/');
        }

        // Ensure path starts with '/'
        if (!path.startsWith('/')) {
            path = '/' + path;
        }

        // If path is empty after processing, use root
        if (path === '') {
            path = '/';
        }

        console.log('Processing request:', {
            originalPath: event.path,
            processedPath: path,
            method: event.httpMethod,
            headers: event.headers,
        });

        // Handle the request
        const response = await server.inject({
            method: event.httpMethod || 'GET',
            url: path,
            headers: event.headers,
            // payload: event.body,
        });

        console.log('Server response:', {
            statusCode: response.statusCode,
            payload: response.payload,
        });

        return {
            statusCode: response.statusCode,
            body: response.payload,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            },
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Server error occurred',
                error: err instanceof Error ? err.message : 'Unknown error',
                originalPath: event.path,
                processedPath: event.path?.replace(/^\/[^/]+/, '') || '/',
            }),
        };
    }
};

module.exports = { lambdaHandler };
