

# 1. Check aws cli version
```bash
aws --version
```

# 2. Check ecs-cli version
```bash
ecs-cli --version
```

# 3. List all ecs clusters
```bash
aws ecs list-clusters
```

# 4. Create ECS cluster with launch-type FARGATE
```bash
ecs-cli up --capability-iam --launch-type EC2 --keypair jchoo-splunk-aws-key-pair --size 2 --instance-type t3.medium --cluster jek-ecs-ec2-cli-cluster-<today date>
```

# 5. Take note of the VPC and subnets that the ECS cluster created in.
Take note of the name of the VPC because when creating the ECS Task (not ECS Task Definitions), we need to select the correct VPC.

# 6. Create ECS task definitions for launch-type EC2
We can use the AWS Web GUI to create a task definition.
![Howtocreatetaskdefinition](how-to-create-task-definitions.png "How to create task definitions")

After which, we create Task, Service, or both.
![thesteps](the-steps-ecs.png "the steps ecs")
source courtesy: https://www.udemy.com/course/aws-ecs-fargate/

# 7. Create a Security Group opening the TCP port required
Search for the Security Group.
![thesteps](how-to-get-security-group.png "the steps ecs")
Add the necessary inbound rules e.g. HTTP, TCP, and the PORT with source Custom.
Notice that it is `All TCP` from `Anywhere`.
![thesteps](how-to-add-the-inbound-rule.png "the steps ecs")

# 8a Either create ECS task OR create ECS service
This example creates a ECS task.
Select the ECS cluster to create the task.
![thesteps](how-to-create-task.png "the steps ecs")

Click the create button
![thesteps](how-to-create-task-next.png "the steps ecs")

Select the task definitions created in above steps.
Please note to select `EC2`.
![thesteps](how-to-create-task-from-task-definition.png "the steps ecs")


# 8b. Either create ECS task OR create ECS service
This example creates a ECS service
![thesteps](how-to-create-ecs-service.png "the steps ecs")

# 9. Send traffic to the endpoint.
Retrieve the public IP address from the ECS task
![thesteps](how-to-get-the-public-ip.png "the steps ecs")

# 10. Add OTel Collector as Daemonset
Go to Splunk O11y portal and use Data Setup
![thesteps](how-to-use-data-setup.png "the steps ecs")





|


|


To be continued from here ----->


|

|


Revise ECS Task Definitions
![thesteps](how-to-create-revision.png "the steps ecs")

Create a second ECS Task from the revised Task Definitions
![thesteps](how-to-create-task-after-revision.png "the steps ecs")

Select the latest revision
![thesteps](how-to-create-task-after-revision-next.png "the steps ecs")

# 11. Verify that the metrics are in Splunk Observability O11y Dashboard

Go to Dashboard Group ECS
![thesteps](how-to-verify-dashboard.png "the steps ecs")

Select a Dashboard
![thesteps](how-to-verify.png "the steps ecs")

# 12. Container Logs from ECS is enabled via ECS setup
When creating Task Defintions, we can select the following options:
![thesteps](how-to-send-logs.png "the steps ecs")

# 13. Clean up ECS Task, ECS Service, or both.

# 14. Remove the addition port to the Security Group.

# 15. Remove the Task Definitions

# 16. List all ecs clusters
```bash
aws ecs list-clusters
```

# 17. Delete the ECS cluster
```bash
ecs-cli down --cluster jek-ecs-ec2-cli-cluster-<today date>
```

# 18.  Check that the cluster is delete
```bash
aws ecs list-clusters
```
