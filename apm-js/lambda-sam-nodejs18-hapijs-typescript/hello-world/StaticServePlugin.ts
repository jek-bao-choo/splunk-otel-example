import * as hapi from '@hapi/hapi';

export class StaticServePlugin implements hapi.PluginBase<unknown, unknown> {
    name = 'StaticServePlugin';
    version = '1.0.0';
    multiple = false; // Add this to properly implement PluginBase

    async register(server: hapi.Server): Promise<void> {
        // Root route
        server.route({
            method: 'GET',
            path: '/',
            handler: () => {
                return { message: 'Hello World WITHOUT lambda layer with Hapi.js - my v1' };
            },
        });

        // Static assets route
        server.route({
            method: 'GET',
            path: '/static/{param*}',
            handler: (request, h) => {
                return h.response(`Static asset: ${request.params.param}`);
            },
        });
    }
}
