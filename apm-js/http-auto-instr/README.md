#My setup
- node v16.13.0
- npm v8.1.0

#13 Steps
1. `npm init`


2. `npm install @splunk/otel --save`


3. `npm install @opentelemetry/instrumentation-http --save`


4. `export OTEL_SERVICE_NAME=jek-http-auto-instr`


5. `export OTEL_TRACES_EXPORTER="jaeger-thrift-splunk"`


6. `export OTEL_EXPORTER_JAEGER_ENDPOINT=https://ingest.<realm from splunk o11y>.signalfx.com/v2/trace`


7. `export SPLUNK_ACCESS_TOKEN=<ingest token from splunk o11y cloud>`


8. `printenv` to view variables are added


9. Create index.js file


10. Add basic code from https://www.section.io/engineering-education/a-raw-nodejs-rest-api-without-frameworks-such-as-express/ to index.js file


11. `node -r @splunk/otel/instrument index.js`


12. Invoke request http://localhost:5000/api
    

13. Invoke error http://localhost:5000

#Misc

- Ref: https://github.com/signalfx/splunk-otel-js
- Proof: ![proof](proof.png "working proof")
- Last updated: 21 Nov 2021