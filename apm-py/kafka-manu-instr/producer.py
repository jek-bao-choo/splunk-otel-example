# Start of OTel part 1
from opentelemetry import trace
from opentelemetry.propagate import inject
# End of OTel part 1


from kafka import KafkaProducer

kafka_topic = "jek_kafka_topic"

# Start of OTel part 2
tracer = trace.get_tracer_provider().get_tracer(__name__)

# Note that kind=... and attributes={...} are the key to having the name of kafka topic shown in Splunk APM
# Thank you to Owais for pointing this out.
with tracer.start_as_current_span("jek_kafka_producer_span",
                                  kind=trace.SpanKind.PRODUCER,
                                  attributes={
                                      "messaging.system": "kafka",
                                      "messaging.destination": kafka_topic
                                  }):
    headers = {}
    inject(headers)
    print("***********headers", headers)
    byte_traceparent = headers['traceparent'].encode('utf-8')
    print("********byte traceparent", byte_traceparent)
# End of OTel part 2


# Start of Kafka part
# For Kafka to use single server instead of cluster Zookeeper
producer = KafkaProducer(bootstrap_servers=['localhost:9092'])

# For Kafka and will create the topic automatically
# Convert string to bytes
future = producer.send(kafka_topic,
                       headers=[('traceparent', byte_traceparent)],
                       value=b'Hello Jek')
result = future.get(timeout=60)  # Block until a single message is sent (or timeout)
# End of Kafka part
