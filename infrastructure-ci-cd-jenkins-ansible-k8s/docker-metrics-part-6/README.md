# Part 1 - Setup a Linux EC2 Instance
- Note that it is not Ubuntu EC2 instance. It is Amazon Linux EC2.
- Launch a new Amazon Linux EC2 Instance
- Choose something with at least 2 vCPU and 8 GB Memory
- Add a second security group of TCP port 8081
- Choose 20 GB storage instead of 8 GB storage.
- Connect to the newly created Amazon Linux EC2 instance
- Use root user privilege `sudo su -`

# Part 2 - Install & Start Docker
- Install Docker on Amazon Linux EC2 instance for CentOS
    - `sudo yum update`
    - `sudo yum search docker`
    - `sudo yum info docker`
    - `sudo yum install docker`
    - `docker --version`
    - `service docker status`
    - `sudo service docker start`
- Create users called dockeradmin
    - `useradd dockeradmin`
    - `passwd dockeradmin`
- Add a user to docker group to manage docker 
    - `usermod -aG docker dockeradmin`

# Part 3 - Run a simple docker container
- `docker run -d -p 80:80 docker/getting-started`
- See that it is running `docker ps`

# Part 4 - Install OTel Collector
- Install Splunk OTel Collector https://docs.splunk.com/Observability/gdi/opentelemetry/opentelemetry.html
- ![](part4.png)

# Part 5 - Add Docker Containers Receiver in OTel Collector Config
- Add Docker Containers receiver to agent_config.yaml file https://docs.splunk.com/Observability/gdi/docker/docker.html


# Proof
- ![](Proof1.png)
- ![](Proof4.png)
- ![](Proof2.png)
- ![](Proof3.png)
- Date: 29 Aug 2022
