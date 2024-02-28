FROM maven:3.8.6-amazoncorretto-17
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src src
RUN mvn package
RUN curl -L https://github.com/signalfx/splunk-otel-java/releases/latest/download/splunk-otel-javaagent.jar -o splunk-otel-javaagent.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-javaagent:./splunk-otel-javaagent.jar", "-Dsplunk.profiler.enabled=true", "-Dsplunk.metrics.enabled=true", "-jar", "target/jekspringwebappmaven-0.0.1-SNAPSHOT.jar" ]