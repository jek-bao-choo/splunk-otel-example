
# Get network IP address
![](networkip.png)

# Docker Compose
- Create the docker-compose.yml with kafka cluster
- Change the docker-compose.yml to use the network ip address.
    - Change this 192.168.XXX.XXX
- `docker compose up -d`
- Test that it is working navigating to 127.0.0.1:3030
    - View logs http://localhost:3030/logs/

# Test that Kafka UI is working
Go to http://localhost:8000

![](kafkaui.png)

If error connecting, try `advertised.listeners=PLAINTEXT://192.168.XXX.106:9092` in the above step and check out https://stackoverflow.com/questions/67763076/connection-to-node-1-127-0-0-19092-could-not-be-established-broker-may-not 

# Create Kafka topic
![](topic.png)