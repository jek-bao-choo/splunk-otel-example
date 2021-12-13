const {connect, StringCodec, headers} = require("nats");


(async () => {
    // to create a connection to a nats-server:
    const nc = await connect();
    console.log(`publisher is connected to ${nc.getServer()}`);

    // headers always have their names turned into a canonical mime header key
    // header names can be any printable ASCII character with the  exception of `:`.
    // header values can be any ASCII character except `\r` or `\n`.
    // see https://www.ietf.org/rfc/rfc822.txt
    const h = headers();
    h.append("id", "123456");
    h.append("unix_time", Date.now().toString());

    // create a codec
    const sc = StringCodec();

    nc.publish("msg.test", sc.encode("hello"), { headers: h });
    nc.publish("msg.test", sc.encode("world"), { headers: h });
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