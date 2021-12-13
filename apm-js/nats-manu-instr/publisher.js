const {connect, StringCodec} = require("nats");


(async () => {
    // to create a connection to a nats-server:
    const nc = await connect();
    console.log(`publisher is connected to ${nc.getServer()}`);

    // create a codec
    const sc = StringCodec();

    nc.publish("msg.test", sc.encode("hello"));
    nc.publish("msg.test", sc.encode("world"));
    nc.publish("msg.test", sc.encode("again"));
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