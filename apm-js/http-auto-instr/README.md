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

# Working with older version of Node.js e.g. Node 8.11.4
The following config versions would work with Node 8.11.4.
```json
{ 
    "@opentelemetry/instrumentation-http": "0.28.0",
    "@splunk/otel": "0.18.0"
}
```

`npm install @splunk/otel@0.18.0 --save`

``

It is recommend to use Node LTS version e.g. v16.17.0 and etc.

# Working with older version of Node.js e.g. Node 8.9.4
The following config versions would work with Node 8.9.4.
```json
{ 
    "@opentelemetry/instrumentation-http": "0.28.0",
    "@splunk/otel": "0.18.0"
}
```
It is recommend to use Node LTS version e.g. v16.17.0 and etc.

# Working with older version of Node.js e.g. Node 8.2.1
Couldn't work because perf_hooks available up to v8.5 https://stackoverflow.com/a/54959678/3073280 . If really can't upgrade then consider https://github.com/signalfx/signalfx-nodejs-tracing which will be deprecated by June 8, 2023. Alternatively, just monitor the logs and metrics from that system.
