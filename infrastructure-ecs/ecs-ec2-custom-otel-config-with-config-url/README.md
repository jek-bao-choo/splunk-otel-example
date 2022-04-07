This is a continuation of ecs-ec2-default-otel-config setup.

The purpose of this guide is to use custom otel configuration instead of default otel configuration file.

# 1. Create the OTel Config .yaml
For this illustrate, we have it in this folder called `custom_ecs_fargate_config.yaml` a snippet of our new addiiton is below.

```yml
  attributes/jek-insert:
    actions:
      - key: "jek-attribute1"
        value: 123
        action: insert
      - key: "jek string key"
        value: "jek hello world"
        action: insert
```
---

```yml
    metrics:
      receivers: [signalfx, smartagent/signalfx-forwarder, smartagent/ecs-metadata, prometheus/internal]
      processors: [memory_limiter, batch, resourcedetection, attributes/jek-insert]
      exporters: [signalfx]
```

Copy the hosted URL of [custom_ecs_fargate_config.yaml](https://raw.githubusercontent.com/jek-bao-choo/splunk-otel-example/main/infrastructure-ecs/ecs-ec2-custom-otel-config-with-config-url/custom_ecs_fargate_config.yaml), we will need it for the next step.

# 2. Create new Task Definitions revision
Use the former AWS experience

Select OTel-Collector container

Add these two

Verify that the Task Definitions .json has these lines.

# 4. Create new Task or Service using the new Task Definitions revision

# 5. Trigger traffic to the app and verify that the metric has a new dimension starting name jek...

# Misc.
- Proof
- Updated 7 April 2022