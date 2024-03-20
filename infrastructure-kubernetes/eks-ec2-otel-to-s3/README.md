Add realm and access token to values.yaml

```
kubectl create ns splunk-monitoring

helm install otel-to-s3 splunk-otel-collector-chart/splunk-otel-collector -n splunk-monitoring --values values.yaml
```