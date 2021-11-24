# My setup

- Python v3.10.0
- Pip v21.2.3
...


# 19 Steps
1. Make sure it is python 3.6 or higher `python --version`


2. Create virtual environment `python -m venv venv`


3. Activate the virtual environment `source venv/bin/activate`


4. Install `pip install 'splunk-opentelemetry[all]'` 


5. Install `splunk-py-trace-bootstrap`


6. `export OTEL_SERVICE_NAME=jek-flask-auto-instr-extra`


7. `export OTEL_TRACES_EXPORTER="jaeger-thrift-splunk"`


8. `export OTEL_EXPORTER_JAEGER_ENDPOINT=https://ingest.<realm from splunk o11y>.signalfx.com/v2/trace`


9. `export SPLUNK_ACCESS_TOKEN=<ingest token from splunk o11y cloud>`


10. Set environment name `export OTEL_RESOURCE_ATTRIBUTES=deployment.environment=jek-dev`
   

11. Set service version `export OTEL_RESOURCE_ATTRIBUTES=service.version=99.99.99`


12. View the packages before installing more `pip freeze`


13. Add `pip install opentelemetry-instrumentation-flask`


14. Add `pip install flask`


15. Create app.py file


16. Add the hello world flask code from this Github repo to your newly created app.py


17. Run the flask app using `splunk-py-trace python app.py`


18. Invoke request via http://127.0.0.1:5000/


19. Deactivate the virtual environment `deactivate`


# Misc

Ref: https://github.com/signalfx/splunk-otel-python

Proof: ![proof](proof.png "working proof")

Last updated: 22 Nov 2021