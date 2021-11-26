# Start of addition for uWSGI tracing
import uwsgidecorators
from splunk_otel.tracing import start_tracing
from opentelemetry.instrumentation.flask import FlaskInstrumentor
# End of addition for uWSGI tracing


from flask import Flask

app = Flask(__name__)


# Start of addition for uWSGI tracing
start_tracing()
FlaskInstrumentor().instrument_app(app)


# End of addition for uWSGI tracing


@app.route('/')
def hello_world():
    return 'Hello World!'


# Start of addition for uWSGI start
application = app
# End of addition for uWSGI start
