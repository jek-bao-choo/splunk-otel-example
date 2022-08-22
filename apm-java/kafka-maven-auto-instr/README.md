# Zookeeper and Kafka #
- Start Kafka on port 9092 and start Zookeeper
    - Using Docker, run the docker-compose.yml in this folder https://towardsdatascience.com/how-to-install-apache-kafka-using-docker-the-easy-way-4ceb00817d8b with `docker-compose -f docker-compose.yml up`
        - After compose successfully, exec into kafka container `docker exec -it kafka /bin/sh` to test that it works
        - See the Kafka version running with `ls /opt` because the kafka is in that folder of the Kafka container.
    - Alternatively, install and start Zookeeper and Kafka using local machine or Mac Homebrew https://jek-bao-choo.medium.com/jeks-kafka-get-started-notes-24f1aaad9212 

- Go to folder containing kafka, then go to `bin` and create the topic `kafka-topics.sh --create --bootstrap-server localhost:9092 --topic my-topic --partitions 3 --replication-factor 1`
- After that check the topic `kafka-topics.sh --describe --bootstrap-server localhost:9092 --topic my-topic`
- List all available topics `kafka-topics.sh --list --bootstrap-server localhost:9092`
- Push messages to my-topic `kafka-console-producer.sh --bootstrap-server localhost:9092 --topic my-topic`
```bash
> abc
> xyz
```
- Pull messages using Kafka console consumer `kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic my-topic --from-beginning`

# Producer.java
- Open IntelliJ
- Create a new project calling it e.g., Jek-Kafka-Java-Producer
- Take note of the GroupId ![](groupid.png)
- Make sure it has Maven e.g. Maven 3 in the Preference > Build section ![](maven.png)
- Create new project using Maven
- Go to Kafka Apache API docs https://kafka.apache.org/documentation/ 
    - We need to install Maven dependencies for Kafka from https://kafka.apache.org/documentation/#producerapi to get the dependencies snippet.
    - Go to pom.xml file in Intellij
    - Add dependency by using Command + N in IntelliJ to add Dependency
    - Search for Kafka in IntelliJ Add dependency UI wizard
    - Alternative add the dependency to pom.xml 
```xml
    <dependencies>
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka-clients</artifactId>
            <version>3.2.1</version>
        </dependency>
    </dependencies>
```
Also add `slf4j-simple`
```xml
    <dependencies>
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka-clients</artifactId>
            <version>3.2.1</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>1.7.36</version>
        </dependency>
    </dependencies>
```

- Load changes ![](dependencies.png)

- Reload all Maven dependencies ![](reload.png)

- After which, go to Kafka javadocs for basic examples of how to create producer.java and consumer.java 

- Create a package in src > main as org.example ![](producer.png)

- Create Producer.java file in src > main > java folder https://kafka.apache.org/32/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html <-- the example code for Producer.java is here.

It would like this.
```java
package org.example;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.util.Properties;

public class Producer {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("linger.ms", 1);
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

        KafkaProducer<String, String> producer = new KafkaProducer<>(props);
        for (int i = 0; i < 100; i++) {
            System.out.println("Messages: " + i);
            producer.send(new ProducerRecord<String, String>("my-topic", Integer.toString(i), Integer.toString(i)));
        }

        producer.close();
    }
}
```

- Test run it with ![](test-producer.png)

- Go to terminal and run a consumer from the terminal `docker exec -it kafka /bin/sh` and `cd bin` and `kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic my-topic`

- Re-run with ![](test-producer.png) to produce the messages to consumer.

- Add the following to Jek-Kafka-Java-Producer pom.xml

```xml
 <build>
        <plugins>
            <plugin>
                <artifactId>maven-assembly-plugin</artifactId>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <archive>
                        <manifest>
                            <mainClass>org.example.Producer</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
            <plugin>
                <!-- Building an executable jar -->
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.2.2</version>
                <configuration>
                    <archive>
                        <manifest>
                            <!-- give full qualified name of your main class-->
                            <mainClass>org.example.Producer</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

![](producerpom.png)

Ref: https://stackoverflow.com/a/49451658/3073280 

- Package Jek-Kafka-Java-Producer into .jar and run ![](run-producer.png)

# Consumer.java

- Open another IntelliJ following the steps above for Consumer.

- Create another new project calling it e.g., Jek-Kafka-Java-Consumer and follow the above steps.

- Create Consumer.java file in src > main > java folder

https://kafka.apache.org/32/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html <-- the example code for Consumer.java is here.

It would like this.
```java
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

public class Consumer {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.setProperty("bootstrap.servers", "localhost:9092");
        props.setProperty("group.id", "test");
        props.setProperty("enable.auto.commit", "true");
        props.setProperty("auto.commit.interval.ms", "1000");
        props.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.setProperty("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Arrays.asList("my-topic"));
        try {
            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
                for (ConsumerRecord<String, String> record : records)
                    System.out.printf("offset = %d, key = %s, value = %s, partition = %s%n", record.offset(), record.key(), record.value(), record.partition());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            consumer.close();
        }
    }
}
```

- Test run it with ![](test-consumer.png)

- Go to terminal and run a consumer from the terminal `docker exec -it kafka /bin/sh` and `cd bin` and `kafka-console-producer.sh --bootstrap-server localhost:9092 --topic my-topic`

- Push messages to my-topic
```bash
> jekv1
> jekv2
```

- Test with the other IntelliJ project called Jek-Kafka-Java-Producer ![](test-producer.png) and we should see the messages populated in Java Consumer console.

# Add splunk-otel-java agent to trace through Kafka
- ... WIP... To be continued...

- Run the producer .jar with splunk-otel-agent and verify that consumer can read from it.
- Package Jek-Kafka-Java-Consumer into .jar
- Run the consumer .jar with splunk-otel-agent and run the producer .jar to make sure the messages are shown in consumer .jar console.
- Go to Splunk Observability console to verify that it is tracing through.

# Ref #
- https://learning.oreilly.com/videos/apache-kafka-complete 