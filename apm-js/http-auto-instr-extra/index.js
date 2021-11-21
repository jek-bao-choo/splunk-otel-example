const { trace, context, propagation } = require('@opentelemetry/api'); // import modules from otel api

const http = require("http");

// const PORT = process.env.PORT || 5000;
const PORT = 5000;

const server = http.createServer(async (req, res) => {
    // Start of extra
    const activeSpan = trace.getSpan(context.active());
    console.log('*****activeSpan', activeSpan)

    let payload = {
        message: 'message from jek-http-auto-instr-extra'
    };

    propagation.inject(trace.setSpan(context.active(), activeSpan), payload);
    console.log('*****payload with propagation inject', JSON.stringify(payload))
    // End of extra

    //set the request route
    if (req.url === "/api" && req.method === "GET") {
        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        //set the response
        res.write("Hi there, This is a Vanilla Node.js API");
        //end the response
        res.end();
    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});