The .yaml shows how to change hostmetrics collection interval.

`helm install --generate-name splunk-otel-collector-chart/splunk-otel-collector --values values.yaml`

Make any changes then upgrade `helm upgrade <release-name> splunk-otel-collector-chart/splunk-otel-collector --values values.yaml`