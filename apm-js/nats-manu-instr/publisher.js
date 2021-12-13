const {connect, StringCodec, headers} = require("nats");
const {trace, context, propagation, ROOT_CONTEXT, SpanKind} = require('@opentelemetry/api'); // import modules from otel api

(async () => {
    // decide on nats subject
    const natsSubject = "jekSubject";

    // to create a connection to a nats-server:
    const nc = await connect();
    console.log(`publisher is connected to ${nc.getServer()}`);

    // headers always have their names turned into a canonical mime header key
    // header names can be any printable ASCII character with the  exception of `:`.
    // header values can be any ASCII character except `\r` or `\n`.
    // see https://www.ietf.org/rfc/rfc822.txt
    const h = headers();
    h.append("unix_time", Date.now().toString());


    /*
    *
    * Start of OTel addition
    *
    * */
    // Todo: Jek fix this section to ensure context propagation works
    const tracer = trace
        .getTracer('jek-publishing-side-of-propagated-context');
    const activeSpan = tracer.startSpan('jek publishing a message',
        {
            kind: SpanKind.PRODUCER,
            attributes: {
                "messaging.system": "nats",
                "messaging.destination": natsSubject
            }
        });
    console.log("*****activeSpan", activeSpan) // *****important to have kind and attributes messaging.system and messaging.destination

    // Add context propagation to object
    let payloadJSON = {};
    propagation.inject(trace.setSpan(context.active(), activeSpan), payloadJSON);
    if (payloadJSON["traceparent"]) {
        h.append("traceparent", payloadJSON["traceparent"].toString());
    }
    /*
    *
    * End of OTel addition
    *
    * */


    // create a codec
    const sc = StringCodec();

    // publish message
    nc.publish(natsSubject, sc.encode("hello Jek"), {headers: h});
    nc.publish(natsSubject, sc.encode("foobar"), {headers: h});
    await delay(10000); // must delay by 10 seconds to make sure messages are sent before closing

    // this promise indicates the client closed
    const done = nc.closed();

    // close the connection
    await nc.close();

    // check if the close was OK
    const err = await done;
    if (err) {
        console.log(`error closing:`, err);
    }
})();

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}