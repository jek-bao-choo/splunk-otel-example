const { Kafka } = require('kafkajs')
const Chance = require('chance')

const chance = new Chance()

const kafka = new Kafka({
    clientId: 'jek-producer-app',
    brokers: ['localhost:9092']
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
