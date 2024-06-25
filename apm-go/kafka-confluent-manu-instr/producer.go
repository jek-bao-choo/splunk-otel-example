package main

import (
	"fmt"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
	"math/rand"
	"time"
)

func main() {
	// Create a new producer instance
	p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "localhost:29092"})
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
