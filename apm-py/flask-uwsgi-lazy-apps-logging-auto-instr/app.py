# Start of addition for uWSGI tracing
from splunk_otel.tracing import start_tracing
from opentelemetry.instrumentation.flask import FlaskInstrumentor
# End of addition for uWSGI tracing


# Start of add logging configuration from 
# Step 1 from Flask docs https://flask.palletsprojects.com/en/2.0.x/logging/ 
# for the config
# Step 2 from Splunk docs https://docs.splunk.com/Observability/gdi/get-data-in/application/python/instrumentation/connect-traces-logs.html 
# for the format %(asctime)s %(levelname)s [%(name)s] [%(filename)s:%(lineno)d] [trace_id=%(otelTraceID)s span_id=%(otelSpanID)s resource.service.name=%(otelServiceName)s] - %(message)s
from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '%(asctime)s %(levelname)s [%(name)s] [%(filename)s:%(lineno)d] [trace_id=%(otelTraceID)s span_id=%(otelSpanID)s resource.service.name=%(otelServiceName)s] - %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})
# End of adding logging configuration and format


from flask import Flask


app = Flask(__name__)


# Start of addition for uWSGI tracing
start_tracing()
FlaskInstrumentor().instrument_app(app)
# End of addition for uWSGI tracing


@app.route('/')
def hello_world():
    app.logger.info('******** The message is Hello Jek *******') # Added this line for logging
    return 'Hello World!'

