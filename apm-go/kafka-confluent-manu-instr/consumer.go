package main

import (
	"context"
	"fmt"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/signalfx/splunk-otel-go/distro"
	"github.com/signalfx/splunk-otel-go/instrumentation/github.com/confluentinc/confluent-kafka-go/kafka/splunkkafka" // Add for OTel Go Kafka
	"log"
	"os"
)

func main() {

	// Optional setenv here. Can do it at OS e.g. export OTEL_RESOURCE_ATTRIBUTES="service.name=my-app,service.version=1.2.3,deployment.environment=production"
	os.Setenv("OTEL_RESOURCE_ATTRIBUTES", "service.name=jek-go-consumer,service.version=1.2.3,deployment.environment=jek-sandbox")

	// Start of OTel Go telemetry portion necessary
	// Either consumer.go, producer.go, or somewhere needs to do the distro.Run() for the splunkkafka lib to work
	sdk, err := distro.Run()
	if err != nil {
		panic(err)
		log.Fatal(err)
	}
	// Ensure all spans are flushed before the application exits.
	defer func() {
		if err := sdk.Shutdown(context.Background()); err != nil {
			panic(err)
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()
	// End of OTel Go telemetry portion necessary

	// Create a new consumer instance
	// For OTel change from kafka to splunkkafka
	//c, err := kafka.NewConsumer(&kafka.ConfigMap{ // before OTel Go Kafka
	c, err := splunkkafka.NewConsumer(&kafka.ConfigMap{ // after OTel Go Kafka
		"bootstrap.servers": "localhost:29092",
		"group.id":          "myGroup",
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		log.Fatalf("Failed to create consumer: %s\n", err)
	}

	defer c.Close()

	// Subscribe to the topic
	err = c.SubscribeTopics([]string{"myTopic"}, nil)
	if err != nil {
		log.Fatalf("Failed to subscribe to topics: %s\n", err)
	}

	// Poll for new messages
	for {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			fmt.Printf("Message on %s: %s\n", msg.TopicPartition, string(msg.Value))
			fmt.Printf("Partition: %d, Offset: %d\n", msg.TopicPartition.Partition, msg.TopicPartition.Offset)

			if len(msg.Headers) > 0 {
				fmt.Printf("Headers: ")
				for _, header := range msg.Headers {
					fmt.Printf("%s: %s, ", header.Key, string(header.Value))
				}
				fmt.Println()
			}
		} else {
			// Errors are informational and automatically handled
			fmt.Printf("Consumer error: %v (%v)\n", err, msg)
		}
	}
}
