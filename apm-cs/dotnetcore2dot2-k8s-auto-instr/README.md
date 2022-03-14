# APM Dotnet Kubernetes Example
An example for a customer on how to use Splunk APM on a .NET application running in Kubernetes. The setup is for spans to be sent to an OTel Collector running in K8s cluster.

# Steps:

Step 1: Install OTel Collector using Splunk Kubernetes Data Setup wizard. Remember to select the relevant namespace when installing the helm chart e.g. 

$ ... `-n dev`


Step 2: Build the image. This step requires adding of CLR Profiler. Another approach is to use initContainer as referenced below.


Step 3: With the newly built image, update the deployment container image. When updating the deployment file at dotnetcore2dot2.yaml you will see that there are a handful of environment variables required. That is to enable CLR Profiler.


Step 4: Create the deployment with the follow command in terminal CLI

$ `kubectl apply -f dotnetcore2dot2.yaml`


Step 5: We enabled debugging on the tracer for this example so that you can see if it's working or not. You should see entries like this in your application container's logs:
```
[DBG] Span started: [s_id: 14938313515406949587, p_id: null, t_id: 1b3b0564434bc315b72ecc905a51a008]

[DBG] Span closed: [s_id: 14938313515406949587, p_id: null, t_id: 1b3b0564434bc315b72ecc905a51a008] for (Service: TestASPNetCoreService, Resource: /, Operation: /, Tags: [environment,signalfx.tracing.library,signalfx.tracing.version,component,span.kind,http.method,http.request.headers.host,http.url,http.status_code])
```

Check that the trace and span ids are printed 

$ `kubectl logs deployment.apps/k8s-dotnet2dot2-auto-instr`

Step 6: Test that it is access using 

$ `kubectl run tmp --image=nginx:alpine -i --rm --restart=Never -- k run tmp --image=nginx:alpine -i --rm --restart=Never -- curl -m 5 -v <pod ip using kubectl get pod -o wide>:<containerPort>`

# Misc

Ref 1: Another approach is to use initContainer. Refer to https://github.com/bxtp4p/dotnet-k8s-test

Ref 2: https://github.com/signalfx/signalfx-dotnet-tracing#configure-the-signalfx-tracing-library-for-net). 

# FAQ

Q: Why don't we need to add our private access token in the environment variable?

A: Because our setup is going through OTel Collector. In using Splunk K8s Data Setup wizard we have added the access token and the realm info.