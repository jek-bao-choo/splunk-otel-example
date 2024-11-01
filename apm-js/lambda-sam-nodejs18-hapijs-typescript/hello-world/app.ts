import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Server } from '@hapi/hapi';
import { StaticServePlugin } from './StaticServePlugin';

let server: Server;

async function initServer(): Promise<Server> {
    const server = new Server({
        port: 3000,
        host: 'localhost',
    });

    // Register the static serve plugin
    await server.register([new StaticServePlugin()]);

    return server;
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        server = await initServer();

        // Make sure to include the path from the event
        const response = await server.inject({
            method: event.httpMethod,
            url: event.path || '/', // Ensure URL is always defined
            // payload: event.body,
            headers: event.headers,
        });

        return {
            statusCode: response.statusCode,
            body: response.payload,
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'JEK ERROR some error happened',
            }),
        };
    }
};

module.exports = { lambdaHandler };
