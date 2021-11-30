Node v16.13.0

npm v8.1.0


1. Install nest cli `npm install -g @nestjs/cli`


2. Create new project with nest cli `nest new <the-project-name>`


3. `cd <the-project-name>`


4. `npm install @splunk/otel --save`


5. `npm install @opentelemetry/instrumentation-http --save`


6. Install two libraries as per https://github.com/pragmaticivan/nestjs-otel  `npm i nestjs-otel @opentelemetry/sdk-node --save`


7. `export OTEL_SERVICE_NAME=jek-nestjs-auto-instr`


8. `export OTEL_TRACES_EXPORTER="jaeger-thrift-splunk"`


9. `export OTEL_EXPORTER_JAEGER_ENDPOINT=https://ingest.<realm from splunk o11y>.signalfx.com/v2/trace`


10. `export SPLUNK_ACCESS_TOKEN=<ingest token from splunk o11y cloud>`


11. `printenv` to view variables are added


12. `nest build`


13. `node -r @splunk/otel/instrument dist/main`


14. Invoke request http://localhost:3000

- Proof: ![proof](proof.png "working proof")
- Last updated: 30 Nov 2021