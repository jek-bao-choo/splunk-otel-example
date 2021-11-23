#This is WIP. Not ready yet

# My Setup
- Python v3.10.0
- Pip v21.2.3
- Docker v20.10.8

# 20 Steps
1. Make sure it is python 3.6 or higher `python --version`


2. Create virtual environment `python -m venv venv`


3. Activate the virtual environment `source venv/bin/activate`


4. Install kafka python library `pip install kafka-python`


5. Install `pip install 'splunk-opentelemetry[all]'` 


6. Install `splunk-py-trace-bootstrap`


7. `export OTEL_SERVICE_NAME=jek-kafka-manu-instr`


8. `export OTEL_TRACES_EXPORTER="jaeger-thrift-splunk"`


9. `export OTEL_EXPORTER_JAEGER_ENDPOINT=https://ingest.<realm from splunk o11y>.signalfx.com/v2/trace`


10. `export SPLUNK_ACCESS_TOKEN=<ingest token from splunk o11y cloud>`


11. Set environment name `export OTEL_RESOURCE_ATTRIBUTES=deployment.environment=jek-dev`
   

12. Set service version `export OTEL_RESOURCE_ATTRIBUTES=service.version=99.99.99`


13. View the packages before installing more `pip freeze`


14. Create producer.py and consumer.py files


15. Add the basic code from this Github repo to your newly created producer.py and consumer.py


16. Start Zookeeper
    

17. Start Kafka
    

18. Run consumer.py `splunk-py-trace python consumer.py`


19. Run producer.py `splunk-py-trace python producer.py`


20. Deactivate the virtual environment when no longer needed `deactivate`


# Misc

Ref: https://github.com/signalfx/splunk-otel-python


Last updated: 23 Nov 2021