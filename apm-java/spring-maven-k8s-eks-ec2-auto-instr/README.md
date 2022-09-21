# Q: I have firewall that prevents download. Can I bundle the splunk-otel-javaagent.jar in an image and ADD IT IN VIA initContainer?

A: The technique of using a splunk-otel-agent bundled in a image and loaded to an initContainer will not work. Because when mounting volume if directory already exists will get wiped. It's intentional and no fix really. Only way would be to populate the directory after mounting is done. Hence, we use initContainer with e.g. wget. 

Ref 1: https://stackoverflow.com/a/62174740/3073280
Ref 2: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-initialization/

THE BELOW TECHNIQUE WILL NOT WORK.
```dockerfile
# FROM busybox:1.28
# WORKDIR /tmp
# RUN wget https://github.com/signalfx/splunk-otel-java/releases/latest/download/splunk-otel-javaagent.jar -O /tmp/splunk-otel-javaagent.jar
```

```yml
# apiVersion: apps/v1
# kind: Deployment
# metadata:
#   name: spring-maven-k8s-eks-ec2-init-container-v6
#   labels:
#     app: javaspringmaven
# spec:
#   replicas: 1
#   selector:
#     matchLabels:
#       app: javaspringmaven
#   template:
#     metadata:
#       labels:
#         app: javaspringmaven
#     spec:
#       containers:
#       - name: jekspringwebappv2
#         image: jchoo/jekspringwebappmavennoagent:v2
#         ports:
#         - containerPort: 8080
#         env:
#           - name: SPLUNK_OTEL_AGENT
#             valueFrom:
#               fieldRef:
#                 fieldPath: status.hostIP
#           - name: OTEL_RESOURCE_ATTRIBUTES
#             value: deployment.environment=jek-sandbox
#           - name: OTEL_SERVICE_NAME
#             value: jek-spring-maven-k8s-eks-ec2-initcontainer-http-v10
#           - name: OTEL_EXPORTER_OTLP_ENDPOINT
#             value: http://$(SPLUNK_OTEL_AGENT):4317
#           - name: SPLUNK_METRICS_ENDPOINT
#             value: http://$(SPLUNK_OTEL_AGENT):9943
#           - name: JAVA_TOOL_OPTIONS
#             value: "-javaagent:/tmp/agent/splunk-otel-javaagent.jar -Dsplunk.metrics.enabled=true -Dsplunk.profiler.enabled=true"
#         volumeMounts:
#         - mountPath: /tmp/agent/
#           name: splunk-otel-java
#       initContainers:
#       - name: splunk-otel-init
#         image: jchoo/splunk-otel-java-initcontainer:v1
#         volumeMounts:
#         - mountPath: /tmp
#           name: splunk-otel-java
#       volumes:
#       - emptyDir: {}
#         name: splunk-otel-java
```
THE ABOVE TECHNIQUE WILL NOT WORK.

--- 

# Q: How does the initContainer technique work?

A: See this https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-initialization/ 

---

# Q: How do we use B3 header? Or what other modification can we do to the deployment yaml file?

A: Add OTEL_PROPAGATORS. For example.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: adservice
spec:
  selector:
    matchLabels:
      app: adservice
  template:
    metadata:
      labels:
        app: adservice
    spec:
      terminationGracePeriodSeconds: 5
      tolerations:
      nodeSelector:
  
      containers:
        - name: server
          image: quay.io/phagen/adserviceprofiling:1
          ports:
            - containerPort: 9555
          env:
            - name: PORT
              value: '9555'
            - name: OTEL_SERVICE_NAME
              value: adservice
            - name:  OTEL_PROPAGATORS
              value: "b3multi" 
            - name: NODE_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.hostIP
            - name: SPLUNK_PROFILER_ENABLED
              value: "true"
            - name: ENABLE_COPYRIGHT_CERTIFICATION
              value: "false"      
            - name: OTEL_TRACE_EXPORTER
              value: otlp
            - name: JAVA_TOOL_OPTIONS
              value: -javaagent:/opt/sfx/splunk-otel-javaagent-all.jar
            - name: OTEL_EXPORTER_OTLP_ENDPOINT
              value: 'http://$(NODE_IP):4317'
          resources:
            requests:
              cpu: 200m
              memory: 180Mi
            limits:
              cpu: 200m
              memory: 200Mi
          readinessProbe:
            initialDelaySeconds: 60
            periodSeconds: 25
            exec:
              command: ['/bin/grpc_health_probe', '-addr=:9555']
          livenessProbe:
            initialDelaySeconds: 60
            periodSeconds: 30
            exec:
              command: ['/bin/grpc_health_probe', '-addr=:9555']
---
apiVersion: v1
kind: Service
metadata:
  name: adservice
spec:
  type: ClusterIP
  selector:
    app: adservice
  ports:
    - name: grpc
      port: 9555
      targetPort: 9555
---
```

---

# Q: What is JAVA_TOOL_OPTIONS? and all info I need to know about the Java JVM command line options?

A: Read here
- Google for Java JVM command line options. Below are the main sites with concise info.
- https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/envvars002.html 
- https://docs.oracle.com/en/java/javase/13/docs/specs/man/java.html
- https://stackoverflow.com/questions/28327620/difference-between-java-options-java-tool-options-and-java-opts
- https://stackoverflow.com/questions/3933300/difference-between-java-opts-and-java-tool-options

---

# Q: ...

A: ...