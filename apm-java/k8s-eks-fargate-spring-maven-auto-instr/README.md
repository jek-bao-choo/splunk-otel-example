This is a continuation of spring-maven-auto-instr; should have completed the spring-maven-auto-instr setup before doing this.
The spring-maven-auto-instr setup sends directly to Splunk O11y backend.
This setup sends traces to Splunk OTel Collector which then send to Splunk O11y backend.

1. Create a file called Dockerfile in the folder `.../jekspringwebapp`. 
This folder should contain pom.xml file, src folder, and splunk-otel-javaagent.jar file.
See the Dockerfile in this folder

2. Build the Dockerfile
```bash
docker build -t jekbao/jekspringwebapp:v1 .
```

3. Run the Docker image as container
Remember to port forward to 5001 from 8080 because 
The sample app is running on port 8080.
```bash
docker run -it --rm \
-e OTEL_RESOURCE_ATTRIBUTES=deployment.environment=jek-sandbox \
-e OTEL_SERVICE_NAME=jek-docker-spring-maven-web-rest-http \
-e OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.<YOUR REALM>.signalfx.com \
-e SPLUNK_ACCESS_TOKEN=<REDACTED FOR SECURITY> \
-p 5002:8080 \
jekbao/jekspringwebapp:v1
```

docker run -it --rm \
-e OTEL_RESOURCE_ATTRIBUTES=deployment.environment=jek-sandbox \
-e OTEL_SERVICE_NAME=jek-docker-spring-maven-web-rest-http \
-e OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.us1.signalfx.com \
-e SPLUNK_ACCESS_TOKEN=HysDu9eWcFv3XA6arBUD0Q \
-p 5002:8080 \
jekbao/jekspringwebapp:v1

4. Test run the web app with endpoint `/greeting`
```bash
# Check that the previous step execution is successful and curl the endpoint.

curl localhost:5002/greeting

# Go to Splunk O11y portal to see that the service is showing up in APM.
```
 
5. Push the image to Dockerhub
```bash
docker push jekbao/jekspringwebapp:v1
```

6. Get the image from Dockerhub.
`jekbao/jekspringwebapp:v1`

7. Install Splunk OTel Collector in EKS Fargate cluster.
Remember to use the Gateway mode. This is important.
Verify that Splunk OTel Collector Gateway is installed. 
```bash
kubectl get all -A
```

```bash
helm ls -A
```
Ensure that there is  Splunk OTel Collector

8. Deploy the yaml file
Update image in k8s-eks-fargate-java-spring.yaml to latest image (e.g. v1) after which create the deployment with the follow command in terminal CLI
```bash
kubectl apply -f k8s-eks-fargate-java-spring.yaml

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

