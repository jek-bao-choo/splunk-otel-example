# Start up OTel Collector in docker container

## Option 1
Change the access token and realm
```
docker run --rm -e SPLUNK_ACCESS_TOKEN=XXXXXXXXXXXXX -e SPLUNK_REALM=us1 \
    -p 13133:13133 -p 14250:14250 -p 14268:14268 -p 4317:4317 -p 4318:4318 -p 6060:6060 \
    -p 7276:7276 -p 8888:8888 -p 9080:9080 -p 9411:9411 -p 9943:9943 \
    --name otelcol quay.io/signalfx/splunk-otel-collector:latest
```

## or Option 2
Change the access token and realm

```yml
docker-compose up
```

After docker compose up run or the docker container run

# Test it 

## Option 1 Sample trace

```
curl -OL https://raw.githubusercontent.com/jek-bao-choo/splunk-otel-example/main/infrastructure-kubernetes/eks-ec2-alb-dual-helm-gateway-collectors/trace-test.json
```

```
curl -vi -X POST http://localhost:4318/v1/traces -H'Content-Type: application/json' -d @trace-test.json
```

## or Option 2 Sample app

```
docker run -p 3009:8080 jchoo/jekspringwebapp:v4
```

Then test 

```
# Invoke success
curl http://localhost:3009/greeting

# 403
curl http://localhost:3009/jek-forbidden

# 404
curl http://localhost:3009/jek-error

# 500
curl http://localhost:3009/jek-server-error
```

