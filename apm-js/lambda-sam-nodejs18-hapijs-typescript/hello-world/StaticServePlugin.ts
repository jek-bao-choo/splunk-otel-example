import * as hapi from '@hapi/hapi';

export class StaticServePlugin implements hapi.PluginBase<unknown, unknown> {
    name = 'StaticServePlugin';
    version = '1.0.0';
    multiple = false;

    async register(server: hapi.Server): Promise<void> {
        server.route({
            method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            path: '/static/{param*}',
            handler: (request) => {
                return {
                    message: `Static asset: ${request.params.param} - WITHOUT lambda layer but with Hapi.js v2`,
                    path: request.path,
                };
            },
        });
    }
}
