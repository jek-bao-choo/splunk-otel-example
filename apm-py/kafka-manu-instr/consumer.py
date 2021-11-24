# Start of OTel part 1
from opentelemetry import trace
from opentelemetry.propagate import extract
# End of OTel part 1


from kafka import KafkaConsumer


# Start of OTel part 2
tracer = trace.get_tracer_provider().get_tracer(__name__)
# Start of OTel part 2


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
    byte_traceparent = message.headers[0][1]
    traceparent = byte_traceparent.decode('utf-8')
    headers = {
        "Traceparent": traceparent
    }
    with tracer.start_as_current_span(
        "jek_kafka_consumer_span",
        context=extract(headers),
        kind=trace.SpanKind.SERVER
    ):
        print("********headers", headers)
        print("********context", extract(headers))  # todo Jek: context is empty
