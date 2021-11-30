Node v16.13.0

npm v8.1.0


1. Install nest cli `npm install -g @nestjs/cli`


2. Create new project with nest cli `nest new <the-project-name>`


3. `cd <the-project-name>`


4. `npm install nestjs-pino`


5. `npm install @splunk/otel --save`


6. `npm install @opentelemetry/instrumentation-http --save`


7. Install two libraries as per https://github.com/pragmaticivan/nestjs-otel  `npm i nestjs-otel @opentelemetry/sdk-node --save`


7. `export OTEL_SERVICE_NAME=jek-nestjs-pinojs-auto-instr`


8. `export OTEL_TRACES_EXPORTER="jaeger-thrift-splunk"`


9. `export OTEL_EXPORTER_JAEGER_ENDPOINT=https://ingest.<realm from splunk o11y>.signalfx.com/v2/trace`


10. `export SPLUNK_ACCESS_TOKEN=<ingest token from splunk o11y cloud>`


11. `printenv` to view variables are added


Add the code logger code from https://github.com/pragmaticivan/nestjs-otel > examples > nestjs-prom-grafana-tempo

12. `nest build`


13. `node -r @splunk/otel/instrument dist/main`


14. Invoke request http://localhost:3000

- Proof: 
- Last updated: 30 Nov 2021