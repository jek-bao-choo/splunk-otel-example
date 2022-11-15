const amqplib = require('amqplib');

var amqp_url = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672';

async function produce(){
    console.log("Publishing");
    var conn = await amqplib.connect(amqp_url, "heartbeat=60");
    var ch = await conn.createChannel()
    var exch = 'test_exchange';
    var q = 'test_queue';
    var rkey = 'test_route';
    var msg = 'Hello World Jek v2!';
    await ch.assertExchange(exch, 'direct', {durable: true}).catch(console.error);
    await ch.assertQueue(q, {durable: true});
    await ch.bindQueue(q, exch, rkey);
    await ch.publish(exch, rkey, Buffer.from(msg));
    setTimeout( function()  {
        ch.close();
        conn.close();},  500 );
}
produce();








// var amqp = require('amqplib');

// amqp.connect(amqp_url).then(function(conn) {
//   return conn.createChannel().then(function(ch) {
//     var q = 'hello';
//     var msg = 'Hello World Jek!';

//     var ok = ch.assertQueue(q, {durable: false});

//     return ok.then(function(_qok) {
//       // NB: `sentToQueue` and `publish` both return a boolean
//       // indicating whether it's OK to send again straight away, or
//       // (when `false`) that you should wait for the event `'drain'`
//       // to fire before writing again. We're just doing the one write,
//       // so we'll ignore it.
//       ch.sendToQueue(q, Buffer.from(msg));
//       console.log(" [x] Sent '%s'", msg);
//       return ch.close();
//     });
//   }).finally(function() { conn.close(); });
// }).catch(console.warn);









// var amqp = require('amqplib');

// amqp.connect('amqp://localhost').then(function(conn) {
//   return conn.createChannel().then(function(ch) {
//     var ex = 'logs';
//     var ok = ch.assertExchange(ex, 'fanout', {durable: false})

//     var message = process.argv.slice(2).join(' ') ||
//       'info: Hello World!';

//     return ok.then(function() {
//       ch.publish(ex, '', Buffer.from(message));
//       console.log(" [x] Sent '%s'", message);
//       return ch.close();
//     });
//   }).finally(function() { conn.close(); });
// }).catch(console.warn);