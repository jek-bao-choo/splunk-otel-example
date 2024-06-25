package main

import (
	"fmt"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
)

func main() {
	// Create a new consumer instance
	c, err := kafka.NewConsumer(&kafka.ConfigMap{
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
