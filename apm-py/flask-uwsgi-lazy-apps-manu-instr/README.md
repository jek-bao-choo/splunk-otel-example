This is work in progress. The remaining work is to test that it is working.

# My setup

- Python v3.10.0
- Pip v21.2.3


# 21 Steps
1. Make sure it is python 3.6 or higher `python --version`


2. Create virtual environment `python -m venv venv`


3. Activate the virtual environment `source venv/bin/activate`


4. Install `pip install 'splunk-opentelemetry[all]'` 


5. Install `splunk-py-trace-bootstrap`


6. `export OTEL_SERVICE_NAME=jek-flask-uwsgi-lazy-app-manu-instr`


7. `export OTEL_TRACES_EXPORTER="jaeger-thrift-splunk"`


8. `export OTEL_EXPORTER_JAEGER_ENDPOINT=https://ingest.<realm from splunk o11y>.signalfx.com/v2/trace`


9. `export SPLUNK_ACCESS_TOKEN=<ingest token from splunk o11y cloud>`


10. Set environment name `export OTEL_RESOURCE_ATTRIBUTES=deployment.environment=jek-dev`
   

11. Set service version `export OTEL_RESOURCE_ATTRIBUTES=service.version=99.99.99`


12. View the packages before installing more `pip freeze`


13. Add `pip install opentelemetry-instrumentation-flask`


14. Add `pip install flask`


15. Add `pip install wheel`


16. Add `pip install uwsgi`


17. Create app.py file


18. Add the hello world flask code with manual instrumentation from this Github repo to your newly created app.py


19. Run the flask app with uwsgi using `uwsgi --http-socket 0.0.0.0:5000 --module app:app --master --strict --die-on-term --vacuum --need-app --harakiri 30 --no-orphans --processes 6 --threads 2 --lazy-apps --cpu-affinity 1 --buffer-size 30000`

- Note the `--lazy-apps` command when running uwsgi. In this case we don't need the @uwsgidecorators.postfork decorator

20. Invoke request via http://127.0.0.1:5000/


21. Deactivate the virtual environment `deactivate`


# Misc

Ref: https://github.com/signalfx/splunk-otel-python

Ack: Thank you to Owais for pointing out the --lazy-apps to run without the decorator as per https://github.com/jek-bao-choo/debugging-with-benz/commit/29a568886418d56672647f16fb2431e6f136c364

Last updated: 26 Nov 2021
