from kafka import KafkaProducer

# Using single server instead of cluster Zookeeper
producer = KafkaProducer(bootstrap_servers=['localhost:9092'])


# Kafka will create the topic automatically
# Convert string to bytes
future = producer.send('jek-kafka-topic',
                       value=b'Hello Jek')
result = future.get(timeout=60)  # Block until a single message is sent (or timeout)
