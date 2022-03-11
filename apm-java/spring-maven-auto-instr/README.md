This is a work in progress. Continue from step 10. The OTLP endpoint isn't working as expected. 

1. Use the Spring CLI to build a simple web app
with the dependency web i.e. -dweb
```bash
spring init -dweb --build maven jekspringwebapp
```
---
```bash
cd jekspringwebapp
```
---
```bash
ls
```

2. Test run the web app
```bash
./mvnw spring-boot:run
```
See that build successful

```bash
curl localhost:8080
```

3. Create a file called `Greeting.java` in `.../jekspringwebapp/src/main/java/com/example/jekspringwebapp` along side with `DemoApplication.java` with the following code
```java
package com.example.jekspringwebapp;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Greeting {
    @RequestMapping("/greeting")
    public String getGreeting() {
        return "Hello Jek REST Service";
    }
}
```

4. Test run the web app with endpoint `/greeting`
```bash
./mvnw spring-boot:run
```
See that build successful

```bash
curl localhost:8080/greeting
```

5. Download the depedencies locally
```bash
./mvnw dependency:go-offline
```

6. Build the project to generate a .jar file
```bash
./mvnw package
```

7. Execute the built jar file
```bash
java -jar target/jekspringwebapp-*.jar
```

8. Test run the web app with endpoint `/greeting`
```bash
curl localhost:8080/greeting
```

9. Run the jar file with splunk-otel-java to send traces directly to Splunk backend
```bash
curl -L https://github.com/signalfx/splunk-otel-java/releases/latest/download/splunk-otel-javaagent.jar \
-o splunk-otel-javaagent.jar
```

10. Execute the built jar file with splunk-otel-javaagent.jar
```bash
export OTEL_RESOURCE_ATTRIBUTES=deployment.environment=jek-sandbox
```
---
```bash
export OTEL_SERVICE_NAME=jek-spring-maven-web-rest-http
```
---
```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.<YOUR REALM>.signalfx.com/v2/trace/otlp
```
---
```bash
export SPLUNK_ACCESS_TOKEN=<REDACTED FOR SECURITY>
```
---
```bash
java -javaagent:./splunk-otel-javaagent.jar -jar target/jekspringwebapp-*.jar
```