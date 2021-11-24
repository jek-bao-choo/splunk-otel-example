// const { startTracing } = require('@splunk/otel');
const { trace, context, setSpan, propagation } = require('@opentelemetry/api'); // otel

// startTracing({
//     serviceName: 'jek-kafkajs-producer-svc',
// });

// const { context, setSpan, propagation } = require('@opentelemetry/api');

const tracer = trace.getTracer('splunk-otel-example-basic');
// const tracer = require('@splunk/otel').startTracing();

const { Kafka } = require('kafkajs')
const Chance = require('chance')

const chance = new Chance()

const kafka = new Kafka({
    clientId: 'jek-kafkajs-producer-app',
    brokers: ['localhost:9092']
})

const producer = kafka.producer()
const topic = 'kafka-topic-19Nov2021'

const produceMessage = async () => {
    const firstSpan = tracer.startSpan('hello'); //otel
    const secondSpan = trace.setSpan(context.active(), firstSpan);

// This will run a function inside a context which has an active span.
//     context.with(secondSpan, doWork);
    // const hahaSpan = tracer.startSpan('jek-message', {}, setSpan(context.active(), firstSpan));
    const traceId = firstSpan.spanContext().traceId;

    const value = chance.animal();
    console.log('value (random animal): ' + value);

    let payload = { data: value, traceId }

    // propagation.inject(setSpan(context.active(), hahaSpan), payload);

    console.log('propagation', propagation, 'traceId', traceId)

    try {
        await producer.send({
            topic,
            messages: [
                {
                    value,
                    // headers: {
                    //     'correlation-id': '2bfb68bb-893a-423b-a7fa-7b568cad5b67',
                    //     'system-id': 'my-system'
                    // } // todo: do we pack the w3c headers here?
                }
            ],
        })
    } catch (error) {
        console.log('error: ' + error);
    }
    // hahaSpan.end();
    firstSpan.end(); // otel
}

const run = async () => {
    // Producing
    await producer.connect()
    setInterval(produceMessage, 10000) // run every 10 seconds
}

run().catch(console.error)
