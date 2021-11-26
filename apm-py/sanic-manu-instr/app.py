from sanic import Sanic
from sanic import response

# Thank you to Don for the sample code https://github.com/wwongpai/sanic-otel-splunk
# Start of OTel part 1
import os
from opentelemetry import trace
from opentelemetry.propagate import inject
from opentelemetry.propagate import extract
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# End of OTel part 1


app = Sanic(__name__)

# Thank you to Don for the sample code https://github.com/wwongpai/sanic-otel-splunk
# Start of OTel part 2
resource = Resource(attributes={
    "service.name": os.getenv('OTEL_SERVICE_NAME')
})
trace.set_tracer_provider(TracerProvider(resource=resource))
tracer = trace.get_tracer(__name__)
otlp_exporter = OTLPSpanExporter(endpoint=os.getenv('OTEL_EXPORTER_OTLP_ENDPOINT'), insecure=True)
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)


# End of OTel part 2


@app.route('/')
async def test(request):
    # Start of OTel part 3
    # Upstream service makes request to sanic server
    # We extract headers coming from upstream service to get trace id and span id
    with tracer.start_as_current_span(
            "jek_sanic_request_server_span",
            context=extract(request.headers),
            kind=trace.SpanKind.SERVER,
            attributes={
                "service.name": os.getenv('OTEL_SERVICE_NAME')
            }
    ):
        print("******** request.headers", request.headers)
        # Invoke downstream service so inject headers and pass it to downstream service.
        # Inject trace id and span id for correlation
        headers = {}
        inject(headers)
        # Do something e.g. async/await to downstream service
        # Or to message bus e.g. Kafka

        # Return response to upstream requester.
        return response.json(
            {'message': 'Hello world!'},
            status=200
        )
    # End of OTel part 3


if __name__ == '__main__':
    app.run()
