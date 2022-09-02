- Create ApsaraDB for Oceanbase cluster ![](create.png)
- Create a tenant in the newly created cluster ![](tenant.png)
- Create an Account and Database within the newly created tenant ![](account.png)
- Do infrastructure-alibaba-cloud > ecs > README.md steps
- Get the connection address from ApsaraDB for Oceanbase and remember to whitelist ECS instance private ip address. ![](connect.png)
- In the ECS instance install mysql client `yum install mysql`
- Test account to the RDS database `mysql -h<the internal url from ApsaraRDS for Oceanbase Connection tab remember to whitelist the ECS instance private ip address for connecting to RDS> -P3306 -u<the account name when creating the ApsaraDB for Oceanbase instance Account> -p<the password when creating the ApsaraDB for Oceanbase instance Account> -c -A oceanbase` ![](connection.png)
- Add MySQL receiver to splunk-otel-collector agent_config in the ECS instance yaml file by following https://docs.splunk.com/Observability/gdi/mysql/mysql.html
- In the ECS instance do `vim /etc/otel/collector/agent_config.yaml`
- ![](config.png)
- ![](config2.png)
- Restart the splunk-otel-collector `sudo systemctl restart splunk-otel-collector`

# Outcome: Did NOT get the metrics
- Troubleshoot...

# Resources
- https://help.aliyun.com/document_detail/331942.html