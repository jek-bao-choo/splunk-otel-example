This is a continuation of spring-maven-docker-auto-instr; should have completed the spring-maven-docker-auto-instr setup before doing this.
The spring-maven-docker-auto-instr setup sends directly to Splunk O11y backend.
This setup sends traces to Splunk OTel Collector which then send to Splunk O11y backend.

1. Install Splunk OTel Collector in EKS Fargate cluster.
Remember to use the Gateway mode. This is important.
Verify that Splunk OTel Collector Gateway is installed. 
```bash
kubectl get all -A
```

```bash
helm ls -A
```
Ensure that there is  Splunk OTel Collector

2. Get the image from Dockerhub https://hub.docker.com/repository/docker/jekbao/jekspringwebapp
For example `jekbao/jekspringwebapp:v1`

3. Deploy the yaml file
Update image in spring-maven-k8s-eks-fargate-deployment.yaml to latest image (e.g. v1) after which create the deployment with the follow command in terminal CLI
```bash
kubectl apply -f spring-maven-k8s-eks-fargate-deployment.yaml

# or if repo is updated
kubectl apply -f https://raw.githubusercontent.com/jek-bao-choo/splunk-otel-example/main/apm-js/k8s-eks-fargate-http-auto-instr/k8s-eks-fargate-nodejs.yaml
```
IMPORTANT: The service name in the yaml file needs to splunk-otel-collector-1646020911.default:4317 where is the service name from kubectl get svc and .default is the namespace of where the service is.
Reference: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/
If have difficulty resolving <svc>.<namespace>... see: 
- https://stackoverflow.com/questions/68515198/how-can-pod-make-http-request-to-other-service-in-k8s
- https://stackoverflow.com/questions/66760610/kubernetes-pod-unable-to-communicate-with-another-pod-using-a-service
- https://stackoverflow.com/questions/71234933/how-to-make-inter-container-calls-within-a-pod-in-elastic-kubernetes-service 

9. Use port forwarding to test
```bash
kubectl port-forward -n dev deployment/k8s-eks-fargate-nodejs-http-auto-instr 3009:<containerPort>

# Invoke success
curl http://localhost:3009/api

# Invoke error
curl http://localhost:3009
```

