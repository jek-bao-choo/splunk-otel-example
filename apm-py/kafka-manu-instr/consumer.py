# Start of OTel part 1
from opentelemetry import trace
from opentelemetry.propagate import extract
# End of OTel part 1


from kafka import KafkaConsumer

kafka_topic = "jek_kafka_topic"

# Start of OTel part 2
tracer = trace.get_tracer_provider().get_tracer(__name__)
# End of OTel part 2


# StopIteration if no message after 60sec
consumer = KafkaConsumer(
    kafka_topic,
    bootstrap_servers=['localhost:9092'],
    group_id='jek_consumer_group',
    consumer_timeout_ms=60000
)

for message in consumer:
    # message value and key are raw bytes -- decode if necessary!
    # e.g., for unicode: `message.value.decode('utf-8')`
    print("%s:%d:%d: headers=%s key=%s value=%s" % (message.topic, message.partition,
                                                    message.offset, message.headers,
                                                    message.key, message.value))
    # Start of OTel part 3
    byte_traceparent = message.headers[0][1]  # this is a quick hack to get traceparent
    traceparent = byte_traceparent.decode('utf-8')  # this is for converting it from byte to string
    headers = {
        "traceparent": traceparent
    }

    # Note that kind=... and attributes={...} are the key to having the name of kafka topic shown in Splunk APM
    # Thank you to Owais for pointing this out.
    with tracer.start_as_current_span(
            "jek_kafka_consumer_span",
            context=extract(headers),
            kind=trace.SpanKind.CONSUMER,
            attributes={
                "messaging.system": "kafka",
                "messaging.destination": kafka_topic
            }
    ):
        print("********headers", headers)
        print("********context", extract(headers))
        # End of OTel part 3
