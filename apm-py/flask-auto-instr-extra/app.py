from flask import Flask, request  # request is part of Extra

# Start of Extra part 1
from opentelemetry import trace
from opentelemetry.propagate import extract
from opentelemetry.instrumentation.wsgi import collect_request_attributes
from opentelemetry.sdk.trace.export import (
    BatchSpanProcessor,
    ConsoleSpanExporter,
)
# End of Extra part 1


app = Flask(__name__)


# Start of Extra part 2
tracer = trace.get_tracer_provider().get_tracer(__name__)

trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(ConsoleSpanExporter())
)
# Start of Extra part 2


@app.route('/')
def hello_world():
    # Start of Extra part 3
    with tracer.start_as_current_span(
        "jek_hello_world_span",
        context=extract(request.headers),
        kind=trace.SpanKind.SERVER,
        attributes=collect_request_attributes(request.environ),
    ):
        print("*********request headers", request.headers)
        print("*********context", extract(request.headers))
        print("**********request param ", request.args.get("param"))
        # Start of Extra part 3
        return 'Hello World!'


if __name__ == '__main__':
    app.run()
