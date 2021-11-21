const {trace, context, propagation, ROOT_CONTEXT} = require('@opentelemetry/api'); // import modules from otel api

const http = require("http");

// const PORT = process.env.PORT || 5000;
const PORT = 5000;

const server = http.createServer(async (req, res) => {
    // *********Start of Extra 1
    // #1
    const activeSpan = trace.getSpan(context.active());
    console.log("*****activeSpan", activeSpan)

    // #2
    const randomGen = (min, max) => Math.floor(Math.random() * max + min);
    const randomNum = randomGen(0, 99);
    activeSpan.addEvent("A random number", {
        randomNum
    })
    console.log("*****randomNum", randomNum)

    // #3
    let payload = {
        message: "message from jek-http-auto-instr-extra"
    };
    propagation.inject(trace.setSpan(context.active(), activeSpan), payload);
    const payloadString = JSON.stringify(payload)
    console.log("*****payload with propagation inject", payloadString);

    // #4
    const payloadJSON = JSON.parse(payloadString);
    const propagatedContext = propagation.extract(ROOT_CONTEXT, payloadJSON);
    console.log("********propagatedContext", propagatedContext);

    // #5
    const childSpan = trace
        .getTracer('jek-receiving-side-of-propagated-context')
        .startSpan("jek consuming a message", {
            attributes: {
                payloadString,
            }
        }, propagatedContext);
    childSpan.end();
    console.log("**********Ended childSpan", childSpan)
    // **********End of Extra 1

    //set the request route
    if (req.url === "/api" && req.method === "GET") {
        //response headers
        res.writeHead(200, {"Content-Type": "application/json"});
        //set the response
        res.write("Hi there, This is a Vanilla Node.js API");
        //end the response
        res.end();
    }

    // If no route present
    else {
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({message: "Route not found"}));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

// Start of Extra 2
setInterval(async () => {

    await trace
        .getTracer('jek-do-something-tracer')
        .startActiveSpan('jek-do-something-span',
            async (span) => {
                console.log("*****interval span", span)

                try {
                    const axios = require("axios");
                    const response = await axios('https://mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8')
                    console.log("*****interval response data", response["data"])
                    throw new Error('Jek has really bad error :/') // Comment this to not throw an error
                } catch (e) {
                    const errorSpan = trace.getSpan(context.active());
                    console.error(`********Critical error`, {traceId: errorSpan.spanContext().traceId});
                    errorSpan.recordException(e);
                }

                span.end();
            });

}, 30000) // every 30 seconds
// End of Extra 2