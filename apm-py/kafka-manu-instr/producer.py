# Start of OTel part 1
from opentelemetry import trace
from opentelemetry.propagate import inject
# End of OTel part 1


from kafka import KafkaProducer # For Kafka


# Start of OTel part 2
tracer = trace.get_tracer_provider().get_tracer(__name__)
headers = {}

with tracer.start_as_current_span("jek_kafka_producer_span"):
    inject(headers)
    print("***********headers", headers)
# Start of OTel part 2


# Start of Kafka part
# For Kafka to use single server instead of cluster Zookeeper
producer = KafkaProducer(bootstrap_servers=['localhost:9092'])


# For Kafka and will create the topic automatically
# Convert string to bytes
future = producer.send('jek-kafka-topic',
                       # headers=headers,
                       value=b'Hello Jek')
result = future.get(timeout=60)  # Block until a single message is sent (or timeout)
# End of Kafka part
