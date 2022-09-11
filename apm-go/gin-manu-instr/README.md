# Develop a RESTful API with Go and Gin
- Follow this instruction https://go.dev/doc/tutorial/web-service-gin
    - Outcome: go.mod, main.go, and go.sum

# Add splunk-otel-go library for telemetry
- Ensure the following requirements are met https://docs.splunk.com/Observability/gdi/get-data-in/application/go/go-otel-requirements.html#ensure-you-are-using-supported-go-versions
    - See go.mod for the minimum version.
    - For splunk-otel-go support of go version 1.16, please use splunk-otel-go v1.0.0 because go version 1.16 support is dropped in splunk-otel-go v1.10 https://github.com/signalfx/splunk-otel-go/releases/tag/v1.1.0 so we go back to the latest previous supported version.
- Follow the instruction here https://github.com/signalfx/splunk-otel-go

## Install the distribution
Run the below command in the folder where go.mod is
```bash
go get github.com/signalfx/splunk-otel-go/distro
```

## Configure OpenTelemetry using the distro package by adding the following code to main.go
```go
package main

import (
	"context"

	"github.com/signalfx/splunk-otel-go/distro"
)

func main() {
	sdk, err := distro.Run()
	if err != nil {
		panic(err)
	}
	// Ensure all spans are flushed before the application exits.
	defer func() {
		if err := sdk.Shutdown(context.Background()); err != nil {
			panic(err)
		}
	}()

	// ...
```

# Add the relevant Go http Otel modules 
- Add Splunk specific instrumentation for the Golang `net/http` package. https://github.com/signalfx/splunk-otel-go/tree/main/instrumentation/net/http/splunkhttp
    - Reference this example https://github.com/signalfx/splunk-otel-go/blob/main/example/main.go
    - Also understand the difference between Splunk net/http/splunkhttp vs net/http from OTel Go
 - If still no traces add other libraries from https://opentelemetry.io/registry/?language=go


## Add the relevant environment variables
```bash
export OTEL_RESOURCE_ATTRIBUTES="service.version=99.99.99,deployment.environment=jek-sandbox"

export OTEL_SERVICE_NAME=go-gin-manu-instr

export SPLUNK_ACCESS_TOKEN=<REDACTED FOR SECURITY>

export SPLUNK_REALM=<realm>

# Might not need this
export OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.<YOUR REALM>.signalfx.com 

# When things are not working, a good first step is to restart the program with debug logging enabled. Do this by setting the OTEL_LOG_LEVEL environment variable to debug.
export OTEL_LOG_LEVEL="debug" 
# Make sure to unset the environment variable after the issue is resolved, as its output might overload systems if left on indefinitely.
```


After adding, run the code and test to invoke traffic
```bash
go run .

curl http://localhost:8080/albums \
    --include \
    --header "Content-Type: application/json" \
    --request "POST" \
    --data '{"id": "4","title": "The Modern Sound of Betty Carter","artist": "Betty Carter","price": 49.99}'

curl http://localhost:8080/albums \
    --header "Content-Type: application/json" \
    --request "GET"

curl http://localhost:8080/albums/2
```