This is a continuation of ecs-ec2-default-otel-config setup.

The example approach to custom otel config is using Systems Manager Parameter Store. 
- Reference for ECS EC2: https://github.com/signalfx/splunk-otel-collector/tree/main/deployments/ecs/ec2#direct-configuration
- Reference for ECS Fargate: https://github.com/signalfx/splunk-otel-collector/tree/main/deployments/fargate#direct-configuration

# 1. Extend ecsTaskExecutionRole IAM permissions.
Go to IAM, to Roles, search for ecsTaskExecutionRole, and select it. 
![thesteps](iam-to-roles.png "the steps ecs")

Select Add permissions --> Attach Policies
![thesteps](attach-policies.png "the steps ecs")

Search for AmazonSSMReadOnlyAccess --> Attach Policies
![thesteps](ssm.png "the steps ecs")
This is similar for using S3 file i.e. search for S3ReadOnlyAccess

# 2. Create Systems Manager Parameter Store
Search for Systems Manager --> Go to Systems Manager
![thesteps](systems-manager.png "the steps ecs")

Ensure in the same region as ECS cluster and create Parameter Store.
![thesteps](sm-parameter-store.png "the steps ecs")

# 3. Create new Task Definitions

# 4. Create new Task or Service using the new Task Definitions