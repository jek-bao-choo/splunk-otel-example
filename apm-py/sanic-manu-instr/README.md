# My setup

- Python v3.10.0
- Pip v21.2.3


# 21 Steps
1. Make sure it is python 3.6 or higher `python --version`


2. Create virtual environment `python -m venv venv`


3. Activate the virtual environment `source venv/bin/activate`


4. Install `pip install 'splunk-opentelemetry[all]'` 


5. Install `splunk-py-trace-bootstrap`


6. `export OTEL_SERVICE_NAME=jek-flask-uwsgi-manu-instr`


7. `export OTEL_TRACES_EXPORTER="jaeger-thrift-splunk"`


8. `export OTEL_EXPORTER_JAEGER_ENDPOINT=https://ingest.<realm from splunk o11y>.signalfx.com/v2/trace`


9. `export SPLUNK_ACCESS_TOKEN=<ingest token from splunk o11y cloud>`


10. Set environment name `export OTEL_RESOURCE_ATTRIBUTES=deployment.environment=jek-dev`
   

11. Set service version `export OTEL_RESOURCE_ATTRIBUTES=service.version=99.99.99`


12. View the packages before installing more `pip freeze`


14. Add `pip install sanic`


17. Create app.py file


18. Add the hello world sanic code with manual instrumentation from this Github repo to your newly created app.py


19. Run the sanic app `sanic app.app`


20. Invoke request via http://127.0.0.1:8000


21. Deactivate the virtual environment `deactivate`


# Misc

Ref: https://github.com/signalfx/splunk-otel-python


Last updated: 22 Nov 2021
