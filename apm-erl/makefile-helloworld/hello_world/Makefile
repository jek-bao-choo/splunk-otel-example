PROJECT = hello_world
PROJECT_DESCRIPTION = Cowboy Hello World example
PROJECT_VERSION = 2

DEPS = cowboy opentelemetry_api opentelemetry
# DEPS = cowboy opentelemetry_api opentelemetry opentelemetry_exporter
dep_cowboy_commit = master

# OpenTelemetry dependencies
dep_opentelemetry_api = git-subfolder https://github.com/open-telemetry/opentelemetry-erlang v1.0.3 apps/opentelemetry_api
dep_opentelemetry = git-subfolder https://github.com/open-telemetry/opentelemetry-erlang v1.0.5 apps/opentelemetry
# dep_opentelemetry_exporter = git-subfolder https://github.com/open-telemetry/opentelemetry-erlang v1.0.0 apps/opentelemetry_exporter

REL_DEPS = relx

include ./erlang.mk
