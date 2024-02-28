# Outcome: There is NO splunk-otel-javaagent.jar added to the Dockerfile.

Preparation

Install Java & Spring CLI 
- `sudo apt-get install wget`
- Install Java https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-on-ubuntu-22-04
    - Take note to install Java v17 not v11
    - `jenv versions` to see which version `java --version`
- Download Spring CLI from https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started.installing.cli.manual-installation
- e.g. `wget https://repo.spring.io/release/org/springframework/boot/spring-boot-cli/2.7.2/spring-boot-cli-2.7.2-bin.tar.gz`
- Unzip e.g. `tar -xvzf spring-boot-cli-2.7.2-bin.tar.gz`
- e.g. `cd spring-2.7.2/bin`
- `./spring --version`

---

1. Use the Spring CLI to build a simple web app
with the dependency web i.e. -dweb
```bash
spring init -dweb --build maven jekspringwebappmaven
```
---
```bash
cd jekspringwebappmaven
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

3. Create a file called `Greeting.java` in `.../jekspringwebappmaven/src/main/java/com/example/jekspringwebapp` along side with `DemoApplication.java` with the following code
```java
package com.example.jekspringwebappmaven;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Greeting {
    @RequestMapping("/greeting")
    public String getGreeting() {
        return "Hello Jek REST Service Maven";
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
java -jar target/jekspringwebappmaven-*.jar
```

8. Test run the web app with endpoint `/greeting`
```bash
curl localhost:8080/greeting
```

12. Create a file called Dockerfile in the folder `.../jekspringwebappmaven`. 
This folder should contain pom.xml file, src folder.
See the Dockerfile in this folder

13. Build the Dockerfile
```bash
docker build -t jchoo/jekspringwebappmavennoagent:v3 .
```
 
16. Push the image to Dockerhub
```bash
docker push jchoo/jekspringwebappmavennoagent:v3
```
