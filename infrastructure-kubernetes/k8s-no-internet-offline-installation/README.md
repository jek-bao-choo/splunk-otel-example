Steps are written by my colleague ZX. Credit to him for his work. I am putting it here for future references.

# No Internet Offline K8s Kubernetes Installation Solution Description

The objective of this document is to demonstrate the necessary steps to install the Splunk OpenTelemetry Collector for Kubernetes in an offline environment, facilitating a rapid deployment.

Outlined below are the steps to install the Splunk OpenTelemetry Collector for Kubernetes offline. Detailed instructions follow in subsequent sections:

- **Prepare a Machine**: Ensure access to the internet and availability of docker commands.
- **Docker Pull**: Use docker to pull the splunk-otel-collector image to your local machine.
- **Push to K8S Repository**: Push the image package to your K8S image repository for installation.
- **Download Helm-Chart**: Obtain the splunk-otel-collector helm-chart for offline use.
- **Copy Helm-Chart to Node**: Transfer the helm chart to your K8S management node.
- **Modify and Decompress**: Alter the repository in the unpacked directory to the image repository used in the previous step.
- **Helm Command Execution**: Use the helm command within the helm-chart directory to deploy the configuration to your K8S cluster.
- **Verification**: Confirm that the deployed pod functions correctly and that Splunk receives data.

# Preparing the Offline Installation Package

This part details the preparation of the offline installation package. Begin by acquiring the latest splunk-otel-collector-chart version number from the provided GitHub link, noting that at the time of this document's creation, the version number was 0.88.0. Replace this with the current version number when installing.

Latest Version Link: [Splunk OpenTelemetry Collector Chart Releases](https://github.com/signalfx/splunk-otel-collector-chart/releases)

## Splunk-Otel-Collector Offline Package Creation

Pull the splunk-otel-collector image with the following command:

```bash
docker pull quay.io/signalfx/splunk-otel-collector:0.88.0
```

Once pulled, save the image locally with the command below. If direct access to the K8S image library is available, bypass this step and push the image directly.

`docker save -o splunk-otel-collector.tgz quay.io/signalfx/splunk-otel-collector:0.88.0`

## Pushing the Splunk-Otel-Collector Package to the Local Image Repository

Prior knowledge of the local image repository address is required. Replace <repo_url:port> accordingly. If a direct connection is available as described earlier, proceed with the TAG and PUSH commands below. If not, transfer the image package to an eligible machine for execution.

Restore the image package to your local Docker repository:

`docker load -i splunk-otel-collector.tgz`

Check the TAG information of the image package:

`docker image list | grep splunk-otel-collector`

Set a TAG compatible with the upload target:

`docker tag quay.io/signalfx/splunk-otel-collector:0.88.0 <repo_url:port>/splunk-otel-collector:0.88.0`

Push the image to the local image repository:

`docker push <repo_url:port>/splunk-otel-collector:0.88.0`

The splunk-otel-collector offline image package is now uploaded.

## Helm Package Download

Access the Helm package directly at the [release page](https://github.com/signalfx/splunk-otel-collector-chart/releases/tag/splunk-otel-collector-0.88.0) to download, or use the Wget command below:

```bash
wget https://github.com/signalfx/splunk-otel-collector-chart/releases/download/splunk-otel-collector-0.88.0/splunk-otel-collector-0.88.0.tgz
```

After downloading, transfer the installation package to the K8S management node.

## Install the Local Image Using Helm
The following outlines the installation of an image using Helm in an offline environment, to be performed on the K8S master node.

## Modify the Image URL
Extract the splunk-otel-collector-0.88.0.tgz into the configuration directory. In values.yaml, change the image.otelcol.repository value to <repo_url:port>/splunk-otel-collector:0.88.0. This ensures the offline image package is used during deployment.

## Configure Splunk-Otel-Collector to Collect Metrics
Due to numerous configuration options, this section highlights only the essential information. For detailed configurations, refer to the example templates provided. These templates cover common configurations and can be adapted to specific needs.

For the metric collection configuration, consult the configuration file outlined below, and collaborate with the implementation engineer to finalize the specific requirements.

```yml
################################################################################
# clusterName is a REQUIRED. It can be set to an arbitrary value that identifies.
# your K8s cluster. The value will be associated with every trace, metric and
# log as "k8s.cluster.name" attribute.
################################################################################

clusterName: "k8s-app-env"

################################################################################
# Splunk Cloud / Splunk Enterprise configuration.
################################################################################

# Specify `endpoint` and `token` in order to send data to Splunk Cloud or Splunk
# Enterprise.
splunkPlatform:
  # Required for Splunk Enterprise/Cloud. URL to a Splunk instance to send data
  # to. e.g. "http://X.X.X.X:8088/services/collector/event". Setting this parameter
  # enables Splunk Platform as a destination. Use the /services/collector/event
  # endpoint for proper extraction of fields.
  endpoint: "https://<xxx.xxx.xxx.xxx>:8088/services/collector"
  # Required for Splunk Enterprise/Cloud (if `endpoint` is specified). Splunk
  # Alternatively the token can be provided as a secret.
  # Refer to https://github.com/signalfx/splunk-otel-collector-chart/blob/main/docs/advanced-configuration.md#provide-tokens-as-a-secret
  # HTTP Event Collector token.
  token: "<xxxxx-xxxxxx-xxxxx-xxxx-xxxx>"

  # Name of the Splunk event type index targeted. Required when ingesting logs to Splunk Platform.
  index: "k8s"
  # Name of the Splunk metric type index targeted. Required when ingesting metrics to Splunk Platform.
  metricsIndex: "k8s_metrics"
  # Name of the Splunk event type index targeted. Required when ingesting traces to Splunk Platform.
  tracesIndex: "k8s"
  # Optional. Default value for `source` field.
  source: "kubernetes"
  # Optional. Default value for `sourcetype` field. For container logs, it will
  # be container name.
  sourcetype: ""
  # Maximum HTTP connections to use simultaneously when sending data.
  maxConnections: 200
  # Whether to disable gzip compression over HTTP. Defaults to true.
  disableCompression: true
  # HTTP timeout when sending data. Defaults to 10s.
  timeout: 10s
  # Idle connection timeout. defaults to 10s
  idleConnTimeout: 10s
  # Whether to skip checking the certificate of the HEC endpoint when sending
  # data over HTTPS.
  insecureSkipVerify: true
  # The PEM-format CA certificate for this client.
  # Alternatively the clientCert, clientKey and caFile can be provided as a secret.
  # Refer to https://github.com/signalfx/splunk-otel-collector-chart/blob/main/docs/advanced-configuration.md#provide-tokens-as-a-secret
  # NOTE: The content of the certificate itself should be used here, not the
  #       file path. The certificate will be stored as a secret in kubernetes.
  clientCert: ""
  # The private key for this client.
  # NOTE: The content of the key itself should be used here, not the file path.
  #       The key will be stored as a secret in kubernetes.
  clientKey: ""
  # The PEM-format CA certificate file.
  # NOTE: The content of the file itself should be used here, not the file path.
  #       The file will be stored as a secret in kubernetes.
  caFile: ""

  # Options to disable or enable particular telemetry data types that will be sent to
  # Splunk Platform. Only logs collection is enabled by default.
  logsEnabled: true
  # If you enable metrics collection, make sure that `metricsIndex` is provided as well.
  metricsEnabled: true
  # If you enable traces collection, make sure that `tracesIndex` is provided as well.
  tracesEnabled: true
  # Field name conventions to use. (Only for those who are migrating from Splunk Connect for Kubernetes helm chart)
  fieldNameConvention:
    # Boolean for renaming pod metadata fields to match to Splunk Connect for Kubernetes helm chart.
    renameFieldsSck: false
    # Boolean for keeping Otel convention fields after renaming it
    keepOtelConvention: true

  # Refer to https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/exporterhelper/README.md#configuration
  # for detailed examples
  retryOnFailure:
    enabled: true
    # Time to wait after the first failure before retrying; ignored if enabled is false
    initialInterval: 5s
    # The upper bound on backoff; ignored if enabled is false
    maxInterval: 30s
    # The maximum amount of time spent trying to send a batch; ignored if enabled is false
    maxElapsedTime: 300s

  sendingQueue:
    enabled: true
    # Number of consumers that dequeue batches; ignored if enabled is false
    numConsumers: 10
    # Maximum number of batches kept in memory before dropping; ignored if enabled is false
    # User should calculate this as num_seconds * requests_per_second where:
    #   num_seconds is the number of seconds to buffer in case of a backend outage
    #   requests_per_second is the average number of requests per seconds.
    queueSize: 5000

    # This option enables the persistent queue to store data on the disk instead of memory before sending it to the backend.
    # It allows setting higher queue limits and preserving the data across restarts of the collector container.
    # NOTE: The File Storage extension will persist state to the node's local file system.
    # While using the persistent queue it is advised to increase memory limit for agent (agent.resources.limits.memory)
    # to 1Gi.
    # Refer to: https://github.com/signalfx/splunk-otel-collector-chart/blob/main/docs/advanced-configuration.md#data-persistence
    persistentQueue:
      # Specifies whether to persist log/metric/trace data.
      enabled: false
      storagePath: "/var/addon/splunk/exporter_queue"

agent:
  extraVolumes:
    - name: nginx-log-volume-shared
      hostPath:
        path: /opt/shared
  extraVolumeMounts:
    - name: nginx-log-volume-shared
      mountPath: /var/log/demo

logsCollection:
  extraFileLogs:
    filelog/nginx-log-volume-hostpath:
      include:
        - /var/log/demo/*.log
      start_at: beginning
      storage: file_storage
      include_file_path: true
      include_file_name: false
      resource:
        com.splunk.source: /var/log/demo
        host.name: 'EXPR(env("K8S_NODE_NAME"))'
        com.splunk.sourcetype: kube:demolog
        com.splunk.index: k8s
      operators:
      - from: attributes.volume_name
        to: resource["k8s.volume.name"]
        type: move

```

### Push Pods to K8S Nodes

Execute the following command on the master node. Remember to replace `<node-name-prefix>` with the actual node's name, `<helm-chart-path>` with the root directory of the splunk-otel-collector from the previous steps, and `<configure_file_path>` with the path to the actual configuration file.

```bash
helm install <node-name-prefix> <helm-chart-path> --values <configure_file_path>
```

### Deployment Verification

Once the installation is complete, run `kubectl get pods` on the master node. If the node status is `Running`, it indicates that the deployment is successful.

## Clean Up the Deployment

### Remove Splunk-Otel-Collector from the K8S Node

To uninstall the splunk-otel-collector deployment, execute the following on the master node:

```bash
helm uninstall <node-name-prefix>
```

### Clean Up the Image in the Local Repository
To remove the image from the machine that uploaded it, start by listing all images:
`docker images`

This command displays all splunk-otel-collector images, including quay.io/signalfx/splunk-otel-collector:0.88.0. Replace xxx.xxx.xxx.xxx:YYYY/splunk-otel-collector:0.88.0 with the appropriate tag used previously.

### Clean Up the Image in the Remote Repository

For cloud-based repository cleanup, contact the repository administrator for detailed instructions.

## Data Validation

When the pod reaches a `Running` state, data collection can be verified.

---

# Perhaps relevant resource
- https://stackoverflow.com/questions/50343089/how-to-use-helm-charts-without-internet-access