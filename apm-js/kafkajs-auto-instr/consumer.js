const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'jek-consumer-app',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'test-group-jek-14nov2021' })

const run = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'jek-kafka-topic-14Nov2021', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
                headers: message.headers
            })
        },
    })
}

run().catch(console.error)
