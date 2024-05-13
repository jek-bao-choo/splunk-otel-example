# Create a Splunk Enterprise instance
- Create 1 events index called `otel_events` and 1 metrics index called `otel_metrics`
![](index.png)

# Setup AKS
- Install Azure CLI on macOS  https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-macos `brew update && brew install azure-cli`
- Login to your azure account `az login`
    - Set the cluster subscription `az account set --subscription XXXXX-XXXX-XXXX-XXXX`
- List all Azure Resource Groups https://learn.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest `az group list`
    - Or create Azure Resource Group `export AZURE_RESOURCE_GROUP="JekAKSResource"`
    - Followed by `az group create --location southeastasia --name "${AZURE_RESOURCE_GROUP}" --tags Criticality=Low Env=Test Owner=email@email.com`

# Create and connect to AKS Cluster
- `export AKS_CLUSTER_NAME="JekAKSCluster"`
- Create AKS cluster https://learn.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-create `az aks create --resource-group "${AZURE_RESOURCE_GROUP}" --name "${AKS_CLUSTER_NAME}" --node-count 2`
- `az aks list`
- `az aks get-credentials --resource-group "${AZURE_RESOURCE_GROUP}" --name "${AKS_CLUSTER_NAME}"` 

# Install OTel Collector Daemonset
- `helm repo add splunk-otel-collector-chart https://signalfx.github.io/splunk-otel-collector-chart`
- Create a v1-values.yaml
```yml
clusterName: "< your cluster name e.g. v1-jek-test-cluster >"
logsEngine: otel
splunkPlatform:
    endpoint: "https://< your splunk enterprise instance id >.ec2.splunkit.io:8088/services/collector"
    token: "00000000-0000-0000-0000-000000000000"
    index: "otel_events"
    metricsIndex: "otel_metrics"
    insecureSkipVerify: true
    metricsEnabled: true
logsCollection:
    containers: 
        containerRuntime: "containerd"
        excludeAgentLogs: false
```
- `helm install -f v1-values.yaml splunk-otel-collector-chart/splunk-otel-collector`
