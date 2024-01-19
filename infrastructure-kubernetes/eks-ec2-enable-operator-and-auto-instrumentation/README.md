
1. https://github.com/signalfx/splunk-otel-collector-chart/blob/main/docs/auto-instrumentation-install.md <-- This is the most important resource of all.
2. https://docs.splunk.com/observability/en/gdi/opentelemetry/zero-config.html <- Useful
3. https://github.com/open-telemetry/opentelemetry-operator#controlling-instrumentation-capabilities
4. https://github.com/signalfx/splunk-otel-collector-chart/blob/main/examples/enable-operator-and-auto-instrumentation/otel-demo-nodejs.md
5. https://github.com/signalfx/splunk-otel-collector-chart/blob/main/examples/enable-operator-and-auto-instrumentation/README.md

---
# Deploy a few apps without instrumentation agents

- `kubectl apply -f java-deployment.yaml`


---

# Deploy OTel Collector Operator

- Ensure that you have installed and configured the Helm 3.6 client.
- `helm repo add splunk-otel-collector-chart https://signalfx.github.io/splunk-otel-collector-chart`
- `helm repo update`
- `kubectl get pods -l app=cert-manager --all-namespaces` Check if a cert-manager is already installed by looking for cert-manager pods.
- Create values.yaml and if cert-manager is deployed, make sure to remove certmanager.enabled=true to the list of values to set.
- `kubectl create ns otel`
- `helm install -n otel splunk-otel-collector splunk-otel-collector-chart/splunk-otel-collector -f values.yaml`
- `kubectl get pods -n otel`
- `kubectl get mutatingwebhookconfiguration.admissionregistration.k8s.io`
- `kubectl get otelinst`
    - `kubectl get otelinst {instrumentation_name} -o yaml`
- Instrument Application by Setting an Annotation
- `kubectl patch deployment <my deployment name> -n default -p '{"spec": {"template":{"metadata":{"annotations":{"instrumentation.opentelemetry.io/inject-java":"otel/splunk-otel-collector"}}}} }'` This is Java example
- `kubectl patch deployment <my deployment name> -n default -p '{"spec": {"template":{"metadata":{"annotations":{"instrumentation.opentelemetry.io/inject-nodejs":"otel/splunk-otel-collector"}}}} }'` This is NodeJS example.

---

* Note: For proper ingestion of trace telemetry data, the deployment.environment attribute must be present in the exported traces. There are two ways to set this attribute:

    - Use the optional environment configuration in values.yaml.
    - Use the Instrumentation spec (operator.instrumentation.spec.env) with the environment variable OTEL_RESOURCE_ATTRIBUTES.
    - Go auto-instrumentation does not support multi-container pods.
    - A container cannot be instrumented with multiple languages.
   - The instrumentation.opentelemetry.io/container-names annotation will be disregarded if a language container name annotation is set.

---

### Troubleshooting the Operator and Cert Manager

#### 1. Check the logs for failures

**Operator Logs:**

```bash
kubectl logs -l app.kubernetes.io/name=operator
```

**Cert-Manager Logs:**

```bash
kubectl logs -l app=certmanager
kubectl logs -l app=cainjector
kubectl logs -l app=webhook
```

#### 2. Cert-Manager Issues

If the operator seems to be hanging, it could be due to the cert-manager not auto-creating the required certificate. To troubleshoot:

- Check the health and logs of the cert-manager pods for potential issues.
- Consider restarting the cert-manager pods.
- Ensure that your cluster has only one instance of cert-manager, which should include `certmanager`, `certmanager-cainjector`, and `certmanager-webhook`.

For additional guidance, refer to the official cert-manager documentation:
- [Troubleshooting Guide](https://cert-manager.io/docs/troubleshooting/)
- [Uninstallation Guide](https://cert-manager.io/v1.2-docs/installation/uninstall/kubernetes/)

#### 3. Validate Certificates

Ensure that the certificate, which the cert-manager creates and the operator utilizes, is available.

```bash
kubectl get certificates
# NAME                                          READY   SECRET                                                           AGE
# splunk-otel-collector-operator-serving-cert   True    splunk-otel-collector-operator-controller-manager-service-cert   5m
```

#### 4. Using a Self-Signed Certificate for the Webhook

The operator supports various methods for managing TLS certificates for the webhook. Below are the options available through the operator, with a brief description for each. For detailed configurations and specific use cases, please refer to the operator’s
[official Helm chart documentation](https://github.com/open-telemetry/opentelemetry-helm-charts/blob/main/charts/opentelemetry-operator/values.yaml).

1. **(Default Functionality) Use certManager to Generate a Self-Signed Certificate:**
  - Ensure that `operator.admissionWebhooks.certManager` is enabled.
  - By default, the OpenTelemetry Operator will use a self-signer issuer.
  - This option takes precedence over other options when enabled.
  - Specific issuer references and annotations can be provided as needed.

2. **Use Helm to Automatically Generate a Self-Signed Certificate:**
  - Ensure that `operator.admissionWebhooks.certManager` is disabled and `operator.admissionWebhooks.autoGenerateCert` is enabled.
  - When these conditions are met, Helm will automatically create a self-signed certificate and secret for you.

3. **Use Your Own Self-Signed Certificate:**
  - Ensure that both `operator.admissionWebhooks.certManager` and `operator.admissionWebhooks.autoGenerateCert` are disabled.
  - Provide paths to your own PEM-encoded certificate, private key, and CA cert.

**Note**: While using a self-signed certificate offers a quicker and simpler setup, it has limitations, such as not being trusted by default by clients.
This may be acceptable for testing purposes or internal environments. For complete configurations and additional guidance, please refer to the provided link to the Helm chart documentation.