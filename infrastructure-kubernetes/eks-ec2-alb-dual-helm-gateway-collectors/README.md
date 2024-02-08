# Architecture
![](architecture.png)

# Ref
- https://github.com/signalfx/splunk-otel-collector-chart/blob/main/examples/route-data-through-gateway-deployed-separately/route-data-through-gateway-deployed-separately-values.yaml
- https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/loadbalancingexporter/example/otel-agent-config.yaml
- https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/loadbalancingexporter/README.md
- https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/tailsamplingprocessor/README.md

```bash
helm repo add splunk-otel-collector-chart https://signalfx.github.io/splunk-otel-collector-chart

helm repo update

kubectl create ns splunk-monitoring
```

# Install first set of gateway collector for traceID load balancing

```bash
helm install traceid-load-balancing-gateway splunk-otel-collector-chart/splunk-otel-collector -n splunk-monitoring --values traceid-load-balancing-otel-collector-gateway-values.yaml

helm ls -n splunk-monitoring

kubectl get deployment -n splunk-monitoring

kubectl get pods -n splunk-monitoring
```

# Install second set of gateway collector for tail sampling

```bash
helm install tail-sampling-gateway splunk-otel-collector-chart/splunk-otel-collector -n splunk-monitoring --values tail-sampling-otel-collector-gateway-values.yaml

helm ls -n splunk-monitoring

kubectl get deployment -n splunk-monitoring

kubectl get pods -n splunk-monitoring
```

# Test if trace can be sent from sample app --> tail sampling gateway --> Splunk
```bash
kubectl apply -f sample-app-sending-to-tail-sampling-gateway.yaml

kubectl get deployment sample-app

kubectl port-forward deployment/sample-app 3009:8080

# Invoke success
curl http://localhost:3009/greeting

# Invoke general
curl http://localhost:3009

# View the logs to verify
kubectl logs deployment/sample-app
```
## Working Proof
![](proof1.png)

# Test if trace can be sent from sample app --> traceID load balancing gateway --> tail sampling gateway --> Splunk
```bash
# Please uncomment in traceid-load-balancing-otel-collector-gateway-values.yaml the commented parts where gateway >> config stuff and do a helm upgrade
helm upgrade traceid-load-balancing-gateway splunk-otel-collector-chart/splunk-otel-collector -n splunk-monitoring --values traceid-load-balancing-otel-collector-gateway-values.yaml

kubectl get deployment -n splunk-monitoring

kubectl logs deployment/traceid-load-balancing-gateway-splunk-otel-collector -n splunk-monitoring

# the Splunk environment is changed to v2 in the deployment sample-app-sending-to-traceid-load-balancing-gateway.yaml file
kubectl apply -f sample-app-sending-to-traceid-load-balancing-gateway.yaml

kubectl port-forward deployment/sample-app 3009:8080

# Invoke success
curl http://localhost:3009/greeting

# Invoke general
curl http://localhost:3009

# View the logs to verify
kubectl logs deployment/sample-app
```
## Working Proof
![](proof2.png)

# Test if tail sampling gateway is sampling
```bash
# Please uncomment in tail-sampling-otel-collector-gateway-values.yaml the commented parts where gateway >> config stuff and do a helm upgrade
helm upgrade tail-sampling-gateway splunk-otel-collector-chart/splunk-otel-collector -n splunk-monitoring --values tail-sampling-otel-collector-gateway-values.yaml

kubectl get deployment -n splunk-monitoring

kubectl logs deployment/tail-sampling-gateway-splunk-otel-collector -n splunk-monitoring

kubectl port-forward deployment/sample-app 3009:8080

# Invoke success
curl http://localhost:3009/greeting

# Invoke general
curl http://localhost:3009

# View the logs to verify
kubectl logs deployment/sample-app

kubectl logs deployment/tail-sampling-gateway-splunk-otel-collector -n splunk-monitoring
```
