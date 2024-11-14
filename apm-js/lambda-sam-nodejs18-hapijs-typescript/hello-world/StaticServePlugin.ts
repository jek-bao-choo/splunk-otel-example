// StaticServePlugin.ts
import * as hapi from '@hapi/hapi';

export class StaticServePlugin implements hapi.PluginBase<unknown, unknown> {
    name = 'StaticServePlugin';
    version = '1.0.0';
    multiple = false;

    private async commonHandler(req: hapi.Request, h: hapi.ResponseToolkit) {
        console.log('commonHandler called with:', {
            path: req.path,
            method: req.method,
            headers: req.headers,
            params: req.params,
        });

        return {
            message: 'Debug response - Jek v1 commonHandler test',
            debug: {
                handlerType: 'commonHandler',
                path: req.path,
                params: req.params,
                method: req.method,
                originalUrl: req.url.toString(),
            },
        };
    }

    async register(server: hapi.Server): Promise<void> {
        console.log('Registering StaticServePlugin routes');

        try {
            // Define routes with explicit types
            const routes: Array<hapi.ServerRoute> = [
                {
                    method: 'GET',
                    path: '/',
                    handler: this.commonHandler,
                },
                {
                    method: 'GET',
                    path: '/hello',
                    handler: async (request: hapi.Request, h: hapi.ResponseToolkit) => {
                        console.log('Static route accessed:', {
                            path: request.path,
                            params: request.params,
                            method: request.method,
                        });

                        return {
                            message: `hello endpoint: ${request.params.param} - WITH lambda layer but with Hapi.js v1`,
                            debug: {
                                path: request.path,
                                params: request.params,
                                method: request.method,
                            },
                        };
                    },
                },
                {
                    method: 'GET',
                    path: '/static/{param*}',
                    handler: async (request: hapi.Request, h: hapi.ResponseToolkit) => {
                        console.log('Static route accessed:', {
                            path: request.path,
                            params: request.params,
                            method: request.method,
                        });

                        return {
                            message: `Static asset: ${request.params.param} - WITH lambda layer but with Hapi.js v2`,
                            debug: {
                                path: request.path,
                                params: request.params,
                                method: request.method,
                            },
                        };
                    },
                },
                {
                    method: 'GET',
                    path: '/_specific/{param*}',
                    handler: async (request: hapi.Request, h: hapi.ResponseToolkit) => {
                        console.log('Specific route accessed:', {
                            path: request.path,
                            params: request.params,
                            method: request.method,
                        });

                        return {
                            message: `Specific route: ${request.params.param} this is the specific route WITH lambda layer but with Hapi.js v3`,
                            debug: {
                                path: request.path,
                                params: request.params,
                                method: request.method,
                            },
                        };
                    },
                },
            ];

            // Register routes and log each registration
            for (const route of routes) {
                console.log(`Registering route: ${route.method} ${route.path}`);
                server.route(route);
            }

            // Log all registered routes for verification
            const registeredRoutes = server.table();
            console.log('Successfully registered routes:',
                JSON.stringify(registeredRoutes.map(route => ({
                    path: route.path,
                    method: route.method,
                })), null, 2)
            );

        } catch (error) {
            console.error('Error registering routes:', error);
            throw error;
        }
    }
}
