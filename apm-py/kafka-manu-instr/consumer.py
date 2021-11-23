from kafka import KafkaConsumer

# StopIteration if no message after 60sec
consumer = KafkaConsumer(
    'jek-kafka-topic',
    bootstrap_servers=['localhost:9092'],
    group_id='jek-consumer-group',
    consumer_timeout_ms=60000
)

for message in consumer:
    # message value and key are raw bytes -- decode if necessary!
    # e.g., for unicode: `message.value.decode('utf-8')`
    print("%s:%d:%d: headers=%s key=%s value=%s" % (message.topic, message.partition,
                                                    message.offset, message.headers,
                                                    message.key, message.value))
