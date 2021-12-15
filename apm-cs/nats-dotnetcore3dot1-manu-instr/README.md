This is WIP.
Next step containerised with Docker so that can add CLR profiler and run it with Profiler.
After adding profiler is to print with trace id and span id to ensure it has local context.

Terminal 1 in subscriber folder

$ `cd subscriber`

$ `dotnet run -verbose`

$ `docker build -t jekbao/natssub . --no-cache`

$ 
```
docker run -it --rm \
-e SIGNALFX_SERVICE_NAME=jek-nats-sub \
-e SIGNALFX_ENDPOINT_URL=https://ingest.<the realm>.signalfx.com/v2/trace \
-e SIGNALFX_ACCESS_TOKEN=<the token> \
-e SIGNALFX_ENV=jek-playground-env \
-e CORECLR_ENABLE_PROFILING=1 \
-e CORECLR_PROFILER="{B4C89B0F-9908-4F73-9F59-0D77C5A06874}" \
-e CORECLR_PROFILER_PATH=/opt/signalfx-dotnet-tracing/SignalFx.Tracing.ClrProfiler.Native.so \
-e SIGNALFX_INTEGRATIONS=/opt/signalfx-dotnet-tracing/integrations.json \
-e SIGNALFX_DOTNET_TRACER_HOME=/opt/signalfx-dotnet-tracing \
-p 5000:80 --name jek_nats_sub jekbao/natssub
```




---


Terminal 2 in publisher folder run

$ `cd publisher`

$ `dotnet run -payload helloworldv1`

$ `docker build -t jekbao/natspub . --no-cache`

$ 
```
docker run -it --rm \
-e SIGNALFX_SERVICE_NAME=jek-nats-pub \
-e SIGNALFX_ENDPOINT_URL=https://ingest.<the realm>.signalfx.com/v2/trace \
-e SIGNALFX_ACCESS_TOKEN=<the token> \
-e SIGNALFX_ENV=jek-playground-env \
-e CORECLR_ENABLE_PROFILING=1 \
-e CORECLR_PROFILER="{B4C89B0F-9908-4F73-9F59-0D77C5A06874}" \
-e CORECLR_PROFILER_PATH=/opt/signalfx-dotnet-tracing/SignalFx.Tracing.ClrProfiler.Native.so \
-e SIGNALFX_INTEGRATIONS=/opt/signalfx-dotnet-tracing/integrations.json \
-e SIGNALFX_DOTNET_TRACER_HOME=/opt/signalfx-dotnet-tracing \
-p 5000:80 --name jek_nats_pub jekbao/natspub
```
