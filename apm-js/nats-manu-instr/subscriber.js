const {connect, StringCodec} = require("nats");

(async () => {
        try {
            // create connection
            const nc = await connect();
            console.log(`subscriber is connected to ${nc.getServer()}`);

            // create a codec
            const sc = StringCodec();

            const sub = nc.subscribe("msg.test");

            for await (const m of sub) {
                console.log(`[${sub.getProcessed()}] message: ${sc.decode(m.data)}`);
                if (m["headers"]) {
                    // reading/setting a header is not case sensitive
                    console.log(`[${sub.getProcessed()}] id:`, m["headers"].get("id"));
                    console.log(`[${sub.getProcessed()}] unix_time:`, m["headers"].get("unix_time"));
                }
            }

            // this promise indicates the client closed
            const done = nc.closed();

            // check if the close was OK
            const err = await done;
            if (err) {
                console.log(`error closing:`, err);
            }
        } catch (err) {
            console.log(`error connecting to ${JSON.stringify(err)}`);
        }
    }
)();
