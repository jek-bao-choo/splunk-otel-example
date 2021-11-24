const { startTracing } = require('@splunk/otel');

startTracing({
    serviceName: 'jek-kafkajs-consumer-svc',
});

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'jek-kafkajs-consumer-app',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'jek-kafka-19nov2021' })
const topic = 'jek-kafka-topic-19Nov2021'

const run = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({
        topic
    })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
                headers: message.headers
            })
            console.log("traceparent: " + message["headers"]["traceparent"])
        },
    })
}

run().catch(console.error)
