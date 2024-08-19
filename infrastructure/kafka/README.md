Optional read for setting up Kafka: https://www.digitalocean.com/community/developer-center/how-to-deploy-kafka-on-docker-and-digitalocean-kubernetes

- `docker-compose up`
- Test that the ports are working `nc -zv localhost 22181`
- Test that the ports are working `nc -zv localhost 29092`
  - Source courtesy https://www.baeldung.com/ops/kafka-docker-setup

Other ref
- https://github.com/billg-splunk/splunk-metrics-oc