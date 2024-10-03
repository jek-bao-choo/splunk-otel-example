# Get started

0. Create a KMS key in AWS KMS (if you don't already have one):
You can do this via the AWS Management Console or using the AWS CLI:
```bash
aws kms create-key --description "EKS Secret Encryption Key"
```
Note the KeyId from the output.


1. Create EKS EC2 cluster using eksctl
Because eksctl tool will create K8s Control Plane (master nodes, etcd, API server, etc), worker nodes, VPC, Security Groups, Subnets, Routes, Internet Gateway, etc.
```bash
eksctl create cluster \
--name=jek-eks-ec2-cluster-<add a date> \
--nodegroup-name=jek-eks-ec2-workers \
--version=1.29 \
--node-type=t3.large \
--nodes 2 \
--region=ap-southeast-1 \
--tags=Env=test \
--tags=Criticality=low \
--tags=Owner=email@email.com \
--managed \
--encrypt-secrets \
--kms-key=arn:aws:kms:ap-southeast-1:YOUR_ACCOUNT_ID:key/YOUR_KMS_KEY_ID \
--dry-run
```
or using the yaml file
```bash
eksctl create cluster -f ./eks-config.yaml --dry-run
```

2. Check that the cluster is created
```bash
eksctl get cluster

aws eks describe-cluster --name jek-eks-ec2-cluster-<add a date> --region ap-southeast-1
```

Once the cluster is created, you can verify the encryption configuration:
```bash
kubectl get storageclasses
```
You should see that the default storage class is using "secretbox" as the encryption provider.

To further verify, you can create a secret and check its encryption:
```bash
kubectl create secret generic test-secret --from-literal=password=mysecretpassword
kubectl get secret test-secret -o yaml
```
The output should show that the secret data is encrypted.

This setup ensures that all Kubernetes secrets in your EKS cluster are encrypted at rest using your specified KMS key.




3. Install Splunk OTel Collector Chart


4. Deploy Kubernetes official example app https://github.com/kubernetes/examples/tree/master/guestbook
```bash
# 1 Create database (redis) master pods
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-deployment.yaml

# 2 Create database (redis) master service
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-service.yaml

# 3 Create redatabase (redis)dis slave pods
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-deployment.yaml

# 4 Create database (redis) slave service
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-service.yaml

# 5 Create app (guestbook) pods
kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml

# 6 Create app (guestbook) service
kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml

# 7 View the app on browser at http://localhost:8080 using port forwarding
kubectl port-forward svc/frontend 8080:80

# 8 Scale to more pods
kubectl scale deployment frontend --replicas=5
```

5. Clean up Kubernetes official example app
```bash
# Delete all
kubectl delete deployment -l app=redis
kubectl delete service -l app=redis
kubectl delete deployment frontend
kubectl delete service frontend
```

6. Clean up EKS EC2 using eksctl
```bash
# View the eks cluster name
eksctl get cluster

# Delete the EKS cluster
eksctl delete cluster jek-eks-ec2-cluster-<the date>
```

# Troubleshoot
- PodSecurityPolicy psp
- ![](Troubleshoot.png)
- ![](PodSecurityPolicy-PSP.png)
- The solution to solve this is create the the PodSecurityPolicy
    - deploy the default EKS policy  https://docs.aws.amazon.com/eks/latest/userguide/pod-security-policy.html

# Proof

- Ref: https://github.com/signalfx/splunk-otel-collector-chart
- Proof: ![proof](proof.png "working proof")
- Last updated: 15 Feb 2022
