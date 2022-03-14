Preparing steps for ECS.
1. Create a cluster configuration, which defines the AWS region to use, resource creation prefixes, and the cluster name to use with the Amazon ECS CLI:
```bash
ecs-cli configure --cluster jek-ecs-fargate-cluster --default-launch-type FARGATE --config-name jek-ecs-fargate-config --region ap-southeast-1
```

2. Create a CLI profile using your access key and secret key:
```bash
ecs-cli configure profile --access-key ${AWS_ACCESS_KEY_ID} --secret-key ${AWS_SECRET_ACCESS_KEY} --profile-name jek-ecs-fargate-profile
```

3. Create an Amazon ECS cluster with the ecs-cli up command. Because you specified Fargate as your default launch type in the cluster configuration, this command creates an empty cluster and a VPC configured with two public subnets.
```bash
ecs-cli up --cluster-config jek-ecs-fargate-config --ecs-profile jek-ecs-fargate-profile
```

4. Using the AWS CLI, retrieve the default security group ID for the VPC. Use the VPC ID from the previous output:
```bash
aws ec2 describe-security-groups --filters Name=vpc-id,Values=<The VPC ID> --region ap-southeast-1
```
The output of this command contains your security group ID, which is used in the next step.

5. Using AWS CLI, add a security group rule to allow inbound access on port 80:
```bash
aws ec2 authorize-security-group-ingress --group-id <THE SECURITY GROUP ID sg-....> --protocol tcp --port 80 --cidr 0.0.0.0/0 --region ap-southeast-1
```

6. Deploy the app










N. Clean up
```bash
ecs-cli compose --project-name tutorial service down --cluster-config jek-ecs-fargate-config --ecs-profile jek-ecs-fargate-profile
```

```bash
ecs-cli down --force --cluster-config jek-ecs-fargate-config --ecs-profile jek-ecs-fargate-profile
```