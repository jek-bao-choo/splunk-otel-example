const amqplib = require('amqplib');

var amqp_url = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672';

async function do_consume() {
    var conn = await amqplib.connect(amqp_url, "heartbeat=60");
    var ch = await conn.createChannel()
    var q = 'test_queue';
    await conn.createChannel();
    await ch.assertQueue(q, {durable: true});
    await ch.consume(q, function (msg) {
        console.log(msg.content.toString());
        ch.ack(msg);
        ch.cancel('myconsumer');
        }, {consumerTag: 'myconsumer'});
    setTimeout( function()  {
        ch.close();
        conn.close();},  500 );
}

do_consume();







// var amqp = require('amqplib');

// amqp.connect(amqp_url).then(function(conn) {
//   process.once('SIGINT', function() { conn.close(); });
//   return conn.createChannel().then(function(ch) {

//     var ok = ch.assertQueue('hello', {durable: false});

//     ok = ok.then(function(_qok) {
//       return ch.consume('hello', function(msg) {
//         console.log(" [x] Received '%s'", msg.content.toString());
//       }, {noAck: true});
//     });

//     return ok.then(function(_consumeOk) {
//       console.log(' [*] Waiting for messages. To exit press CTRL+C');
//     });
//   });
// }).catch(console.warn);










// var amqp = require('amqplib');

// amqp.connect('amqp://localhost').then(function(conn) {
//   process.once('SIGINT', function() { conn.close(); });
//   return conn.createChannel().then(function(ch) {
//     var ok = ch.assertExchange('logs', 'fanout', {durable: false});
//     ok = ok.then(function() {
//       return ch.assertQueue('', {exclusive: true});
//     });
//     ok = ok.then(function(qok) {
//       return ch.bindQueue(qok.queue, 'logs', '').then(function() {
//         return qok.queue;
//       });
//     });
//     ok = ok.then(function(queue) {
//       return ch.consume(queue, logMessage, {noAck: true});
//     });
//     return ok.then(function() {
//       console.log(' [*] Waiting for logs. To exit press CTRL+C');
//     });

//     function logMessage(msg) {
//       console.log(" [x] '%s'", msg.content.toString());
//     }
//   });
// }).catch(console.warn);