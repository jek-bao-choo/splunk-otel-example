This step through would simulate network devices using SNMPD. After which, we will monitor the simulated network device metrics using SNMP receiver.

# Spin up an EC2 Ubuntu instance to simulate a network device using snmpd and install SNMP to monitor the CPU and memory usage of the simulated device.

Install snmpd:

```
sudo apt update
sudo apt install snmpd snmp
```

Configure snmpd:

```
sudo nano /etc/snmp/snmpd.conf
Replace the contents with:
Copyrocommunity public
syslocation "Server Room"
syscontact Admin 
sysname SimulatedSwitch
extend ifInOctets /bin/echo 1000000
extend cpuUsage /bin/echo 50
extend memUsage /bin/echo 75
```

Restart snmpd:

```
sudo systemctl restart snmpd
```

## Test the setup:


For ifInOctets:
```
snmpwalk -v2c -c public localhost .1.3.6.1.4.1.8072.1.3.2.3.1.2.10.105.102.73.110.79.99.116.101.116.115
```

For CPU usage:
```
snmpwalk -v2c -c public localhost .1.3.6.1.4.1.8072.1.3.2.3.1.2.8.99.112.117.85.115.97.103.101
```

For memory usage:
```
snmpwalk -v2c -c public localhost .1.3.6.1.4.1.8072.1.3.2.3.1.2.8.109.101.109.85.115.97.103.101
```

# Spin up a second EC2 Ubuntu instance for monitoring the simulated device remotely
Install snmp:

```
sudo apt update
sudo apt install snmp
```

## Configure snmpd on the first EC2 (SNMP agent):

Edit /etc/snmp/snmpd.conf:

```
sudo nano /etc/snmp/snmpd.conf
```

Add or modify these lines:

```
rocommunity public <IP_of_monitoring_EC2>
agentAddress udp:161,udp6:[::1]:161

```
Replace `<IP_of_monitoring_EC2>` with the actual IP of your second EC2.


Restart snmpd:

```
sudo systemctl restart snmpd
```

Adjust EC2 Security Group:

- In the AWS Console, go to the Security Group for the EC2 running snmpd.
- Add an inbound rule: Type: Custom UDP, Port Range: 161, Source: `<IP_of_monitoring_EC2>/32`


## On the monitoring EC2, test the connection in the second EC2 instance:


For ifInOctets:
```
snmpwalk -v2c -c public <IP_of_SNMP_agent_EC2> .1.3.6.1.4.1.8072.1.3.2.3.1.2.10.105.102.73.110.79.99.116.101.116.115
```

For CPU usage:
```
snmpwalk -v2c -c public <IP_of_SNMP_agent_EC2> .1.3.6.1.4.1.8072.1.3.2.3.1.2.8.99.112.117.85.115.97.103.101
```

For memory usage:
```
snmpwalk -v2c -c public <IP_of_SNMP_agent_EC2> .1.3.6.1.4.1.8072.1.3.2.3.1.2.8.109.101.109.85.115.97.103.101
```

Replace `<IP_of_SNMP_agent_EC2>` with the actual IP or hostname of the first EC2.

Configure your SNMP monitoring tool on the second EC2 to query the first EC2:

- Use the IP address of the first EC2 as the target
Use 'public' as the community string (or whatever you set in step 1)
- Use UDP port 161
Set up queries for the OIDs you're interested in:

- ifInOctets: .1.3.6.1.4.1.8072.1.3.2.3.1.2.10.105.102.73.110.79.99.116.101.116.115
- CPU usage: .1.3.6.1.4.1.8072.1.3.2.3.1.2.8.99.112.117.85.115.97.103.101
- Memory usage: .1.3.6.1.4.1.8072.1.3.2.3.1.2.8.109.101.109.85.115.97.103.101

![](proof1.png)

## Add OpenTelemetry in the second EC2 instance
Install OpenTelemetry: