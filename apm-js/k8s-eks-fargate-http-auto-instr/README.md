#My setup
- node v16.13.0
- npm v8.1.0

#4 Steps
Pre-req: The containerization of Node.js was done in k8s-daemonset-http-auto-instr

1. Ensure that Splunk OTel Collector Chart is installed

2. Update image in k8s-eks-fargate-nodejs.yaml to latest image v1.0.2 after which create the deployment with the follow command in terminal CLI
```bash
kubectl -n dev apply -f k8s-eks-fargate-nodejs.yaml`

# or if repo is updated
kubectl -n dev apply -f https://raw.githubusercontent.com/jek-bao-choo/splunk-otel-example/main/apm-js/k8s-eks-fargate-http-auto-instr/k8s-eks-fargate-nodejs.yaml
```
IMPORTANT: The service name in the yaml file needs to splunk-otel-collector-1646020911.default:4317 where is the service name from kubectl get svc and .default is the namespace of where the service is.

3. Test that can connect to pod
```bash
# Invoke success
kubectl run tmp -n dev --image=nginx:alpine -i --rm --restart=Never -- curl -m 5 -v <pod ip using kubectl get pod -n dev -o wide>:<containerPort>/api

# Invoke error
kubectl run tmp -n dev --image=nginx:alpine -i --rm --restart=Never -- curl -m 5 -v <pod ip using kubectl get pod -n dev -o wide>:<containerPort>
```

4. Or use port forwarding if permitted
```bash
kubectl port-forward -n dev deployment/k8s-eks-fargate-nodejs-http-auto-instr 3009:<containerPort>

# Invoke success
curl http://localhost:3009/api

# Invoke error
curl http://localhost:3009
```

#Misc
- Ref: https://github.com/signalfx/splunk-otel-js
- Proof: ![proof](proof.png "working proof")
- Last updated: 1 Mar 2022