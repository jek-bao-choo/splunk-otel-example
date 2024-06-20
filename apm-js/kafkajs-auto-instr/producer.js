require('dotenv').config({ path: '.env.producer' })

// Log some environment variables
console.log('OTEL_SERVICE_NAME:', process.env.OTEL_SERVICE_NAME);
console.log('OTEL_RESOURCE_ATTRIBUTES:', process.env.OTEL_RESOURCE_ATTRIBUTES);

const { Kafka } = require('kafkajs')
const Chance = require('chance')

const chance = new Chance()

const kafka = new Kafka({
    clientId: 'jek-producer-app',
    brokers: ['localhost:29092']
})

const producer = kafka.producer()
const topic = 'jek-kafka-topic-14Nov2021'

const produceMessage = async () => {
    const value = chance.name();
    console.log('value (random name): ' + value);

    try {
        await producer.send({
            topic,
            messages: [
                {
                    value
                }
            ],
        })
    } catch (error) {
        console.log('error: ' + error);
    }
}

const run = async () => {
    // Producing
    await producer.connect()
    setInterval(produceMessage, 10000) // run every 10 seconds
}

run().catch(console.error)
