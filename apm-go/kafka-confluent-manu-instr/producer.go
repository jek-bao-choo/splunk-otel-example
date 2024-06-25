package main

import (
	"fmt"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/signalfx/splunk-otel-go/instrumentation/github.com/confluentinc/confluent-kafka-go/kafka/splunkkafka" // Add for OTel Go Kafka
	"log"
	"math/rand"
	"os"
	"time"
)

func main() {
	// Optional setenv here. Can do it at OS e.g. export OTEL_RESOURCE_ATTRIBUTES="service.name=my-app,service.version=1.2.3,deployment.environment=production"
	os.Setenv("OTEL_RESOURCE_ATTRIBUTES", "service.name=jek-go-producer,service.version=1.2.3,deployment.environment=jek-sandbox")

	// Start of OTel Go telemetry portion necessary
	// Either consumer.go, producer.go, or somewhere needs to do the distro.Run() for the splunkkafka lib to work
	//sdk, err := distro.Run()
	//if err != nil {
	//	panic(err)
	//	log.Fatal(err)
	//}
	//// Ensure all spans are flushed before the application exits.
	//defer func() {
	//	if err := sdk.Shutdown(context.Background()); err != nil {
	//		panic(err)
	//		log.Printf("Error shutting down tracer provider: %v", err)
	//	}
	//}()
	// End of OTel Go telemetry portion necessary

	// Create a new producer instance
	// For OTel change from kafka to splunkkafka
	//p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "localhost:29092"}) // before OTel Go Kafka
	p, err := splunkkafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "localhost:29092"}) // after OTel Go Kafka
	if err != nil {
		log.Fatalf("Failed to create producer: %s\n", err)
	}

	defer p.Close()

	// Delivery report handler for produced messages
	go func() {
		for e := range p.Events() {
			switch ev := e.(type) {
			case *kafka.Message:
				if ev.TopicPartition.Error != nil {
					fmt.Printf("Delivery failed: %v\n", ev.TopicPartition)
				} else {
					fmt.Printf("Delivered message to %v\n", ev.TopicPartition)
				}
			}
		}
	}()

	topic := "myTopic"

	// Create a new random source and random generator
	source := rand.NewSource(time.Now().UnixNano())
	r := rand.New(source)

	// Produce random messages every 10 seconds
	for {
		randomValue := fmt.Sprintf("RandomValue-%d", r.Intn(1000))

		err := p.Produce(&kafka.Message{
			TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
			Value:          []byte(randomValue),
		}, nil)

		if err != nil {
			fmt.Printf("Failed to produce message: %v\n", err)
		} else {
			fmt.Printf("Produced message: %s\n", randomValue)
		}

		// Wait for 10 seconds
		time.Sleep(10 * time.Second)
	}
}
