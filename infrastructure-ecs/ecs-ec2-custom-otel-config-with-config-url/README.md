This is a continuation of ecs-ec2-default-otel-config setup.


# 1. Create the OTel Config .yaml
For this illustrate, we have it in this folder called `custom_ecs_fargate_config.yaml` a snippet of it is below.

```yml
  attributes/insert:
    actions:
      - key: "jek-attribute1"
        value: 123
        action: insert
      - key: "jek-string key"
        from_attribute: "jek-anotherkey"
        action: insert
```
---

```yml
    metrics:
      receivers: [signalfx, smartagent/signalfx-forwarder, smartagent/ecs-metadata, prometheus/internal]
      processors: [memory_limiter, batch, resourcedetection, attributes/insert]
      exporters: [signalfx]
```

Copy the hosted URL of `custom_ecs_fargate_config.yaml`, we will need it for the next step.

# 3. Create new Task Definitions

# 4. Create new Task or Service using the new Task Definitions