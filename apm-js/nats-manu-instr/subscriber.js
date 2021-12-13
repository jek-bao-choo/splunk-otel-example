const {connect, StringCodec} = require("nats");
const {trace, propagation, ROOT_CONTEXT, SpanKind} = require('@opentelemetry/api'); // import modules from otel api

(async () => {
        // decide on nats subject
        const natsSubject = "jekSubject";

        // create connection
        const nc = await connect();
        console.log(`subscriber is connected to ${nc.getServer()}`);

        // create a codec
        const sc = StringCodec();

        const sub = nc.subscribe(natsSubject);

        // loop through subscription for all messages
        for await (const m of sub) {

            // print message body
            console.log(`[${sub.getProcessed()}] message: ${sc.decode(m.data)}`);

            // check if headers exist
            if (m["headers"]) {

                // reading/setting a header is not case sensitive
                console.log(`[${sub.getProcessed()}] unix_time:`, m["headers"].get("unix_time"));


                /*
                 *
                 * Start of OTel addition
                 *
                 * */
                // Todo: Jek fix this section to ensure context propagation works
                if (m["headers"].get("traceparent")) {
                    const traceparent = m["headers"].get("traceparent");
                    console.log(`[${sub.getProcessed()}] traceparent:`, traceparent);

                    const payloadJSON = {
                        traceparent: traceparent
                    }

                    const propagatedContext = propagation.extract(ROOT_CONTEXT, payloadJSON);

                    const childSpan = trace
                        .getTracer('jek-subscribing-side-of-propagated-context')
                        .startSpan("jek subscribing a message", {
                            kind: SpanKind.CONSUMER,
                            attributes: {
                                "messaging.system": "nats",
                                "messaging.destination": natsSubject
                            }
                        }, propagatedContext);
                    childSpan.end();
                    console.log("**********Ended childSpan", childSpan)
                }
                /*
                 *
                 * End of OTel addition
                 *
                 * */


            }
        }

        // this promise indicates the client closed
        const done = nc.closed();

        // check if the close was OK
        const err = await done;
        if (err) {
            console.log(`error closing:`, err);
        }
    }
)();
