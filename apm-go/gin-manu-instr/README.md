# Develop a RESTful API with Go and Gin
- Follow this instruction https://go.dev/doc/tutorial/web-service-gin
    - Outcome: go.mod, main.go, and go.sum

# Add splunk-otel-go library for telemetry
- Ensure the following requirements are met https://docs.splunk.com/Observability/gdi/get-data-in/application/go/go-otel-requirements.html#ensure-you-are-using-supported-go-versions
    - See go.mod for the minimum version.
    - For splunk-otel-go support of go version 1.16, please use splunk-otel-go v1.0.0 because go version 1.16 support is dropped in splunk-otel-go v1.10 https://github.com/signalfx/splunk-otel-go/releases/tag/v1.1.0 so we go back to the latest previous supported version.
- Follow the instruction here 

## Install the distribution
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