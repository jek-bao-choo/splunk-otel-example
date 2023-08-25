# Send dummy traces to APM Server using curl.

## Direct Usage String

```bash
$ curl -X POST "https://ingest.{REALM}.signalfx.com/v2/trace/otlp" -H"Content-Type: application/x-protobuf" -H "X-SF-Token: <value>" -d "[]"
```


## Direct Usage File

```bash
$ curl -OL https://raw.githubusercontent.com/openzipkin/zipkin/master/zipkin-lens/testdata/traceotlp.json

$ curl -X POST "https://ingest.{REALM}.signalfx.com/v2/trace/otlp" -H"Content-Type: application/x-protobuf" -H "X-SF-Token: <value>" -d @traceotlp.json
```

## Through OpenTelemetry Collector Usage String

```bash
$ curl -X POST localhost:9411/api/v2/spans -H"Content-Type: application/x-protobuf" -d "[]"
```

## Through OpenTelemetry Collector Usage File

```bash
$ curl -OL https://raw.githubusercontent.com/openzipkin/zipkin/master/zipkin-lens/testdata/traceotlp.json

$ curl -X POST localhost:9411/api/v2/spans -H"Content-Type: application/x-protobuf" -d @traceotlp.json
```

# Reference
- https://dev.splunk.com/observability/reference/api/ingest_data/latest#endpoint-sendotlptraces
- https://opentelemetry.io/docs/specs/otlp/
- https://www.honeycomb.io/blog/test-span-opentelemetry-collector#sample_otlp_json_trace_span
- https://github.com/signalfx/splunk-otel-collector/blob/main/docs/troubleshooting.md#trace-collection
- https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/file-exporter.md
- 