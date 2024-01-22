The purpose of this is to validate that Splunk OTel Collector works with EKS EC2 Bottlerocket AMI.

# Ref
- https://docs.aws.amazon.com/eks/latest/userguide/launch-node-bottlerocket.html
- https://github.com/bottlerocket-os/bottlerocket/blob/develop/QUICKSTART-EKS.md
- https://repost.aws/knowledge-center/eks-bottlerocket-node-group


# Steps
``` bash
# This procedure requires eksctl version 0.167.0 or later. You can check your version with the following command:
eksctl version

# update the file bottlerocket.yaml with the relevant info

eksctl create cluster -f ./bottlerocket.yaml --dry-run

eksctl create cluster -f ./bottlerocket.yaml

```