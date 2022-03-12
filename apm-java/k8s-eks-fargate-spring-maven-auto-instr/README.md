This is a continuation of spring-maven-auto-instr; should have completed the spring-maven-auto-instr setup before doing this.
The spring-maven-auto-instr setup sends directly to Splunk O11y backend.
This setup sends traces to Splunk OTel Collector which then send to Splunk O11y backend.

1. Create a file called Dockerfile in the folder `.../jekspringwebapp`. 
This folder should contain pom.xml file, src folder, and splunk-otel-javaagent.jar file.
See the Dockerfile in this folder

2. Build the Dockerfile
```bash
docker build -t jekspringwebapp:v1 .
```


N. Run the Docker image as container
Remember to port forward to 5001 from 8080 because 
The sample app is running on port 8080.
```bash
docker run -it --rm -p 5002:8080 jekspringwebapp:v1
```
 
3. Push the image to Dockerhub


4. Get the image from Dockerhub.

5. Install Splunk OTel Collector in EKS Fargate cluster.
Remember to use the Gateway mode

6. Deploy the yaml file

7. Forward the port


N. Test run the web app with endpoint `/greeting`
```bash
# Check that the previous step execution is successful and curl the endpoint.

curl localhost:5002/greeting

# Go to Splunk O11y portal to see that the service is showing up in APM.
```