mywebapp
=====

An OTP application

Build
-----

    $ rebar3 compile

Shell
____

    $ rebar3 shell


    $ rebar3 shell --config config/sys.config


    $ OTEL_EXPORTER_OTLP_PROTOCOL=grpc OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 rebar3 shell
