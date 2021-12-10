Steps:

1. Use Visual Studio 2019 to create a hello world project with the name aspdotnetcore3dot1-auto-instr by selecting New > App > ASP.NET Core > Empty


2. Open terminal and run `dotnet run`


3. Test that it is working by navigating to `http://localhost:5000/`


4. Publish to release using `dotnet publish -c Release -o published`


5. Use Visual Studio 2019 to auto generate a Dockerfile by right clicking on Project Name > Add > Add Docker Support
It would generate a Dockerfile like below
```
FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["aspdotnetcore3dot1-auto-instr.csproj", "."]
RUN dotnet restore "./aspdotnetcore3dot1-auto-instr.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "aspdotnetcore3dot1-auto-instr.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "aspdotnetcore3dot1-auto-instr.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "aspdotnetcore3dot1-auto-instr.dll"]

```


6. Open termanal and run the build command arguments:
- Name the image aspdotnetcore3dot1.
- Look for the Dockerfile in the current folder (the period at the end) as per https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images?view=aspnetcore-3.1
- Run without taking from cache
`docker build -t jekbao/aspdotnetcore3dot1 . --no-cache`


7. The run command arguments:
    Allocate a pseudo-TTY and keep it open even if not attached. (Same effect as --interactive --tty.)
    Automatically remove the container when it exits.
    Map port 5000 on the local machine to port 80 in the container.
    Name the container aspnetcore_sample.
    Specify the aspnetapp image.

`docker run -it --rm -p 5000:80 --name jek_aspnetcore3dot1 jekbao/aspdotnetcore3dot1`


8. Test the app at `http://localhost:5000`


9. Download CLRProfiler from https://github.com/signalfx/signalfx-dotnet-tracing/releases/latest


10. In Dockerfile add the CLRProfiler by copying the distribution into container
Note: Take note of the version e.g. signalfx-dotnet-tracing_0.1.xxxxxxx_amd64.deb
```
FROM base AS final
WORKDIR /app
COPY signalfx-dotnet-tracing* .
RUN dpkg -i signalfx-dotnet-tracing_0.<the latest version>_amd64.deb
RUN mkdir /opt/tracelogs
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "aspdotnetcore3dot1-auto-instr.dll"]
```


11. Add code to print if profiler is attached
```

        using System.Reflection; // for BindingFlags.xxxxxx
        using System.Collections; // for DictionaryEntry


        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            
            app.UseEndpoints(endpoints =>
                             {
                                 endpoints.MapGet("/", async context =>
                                                       {
                                                           var instrumentationType = Type.GetType("Datadog.Trace.ClrProfiler.Instrumentation, SignalFx.Tracing.ClrProfiler.Managed");
                                                           var profilerAttached = instrumentationType?.GetProperty("ProfilerAttached", BindingFlags.Public | BindingFlags.Static)?.GetValue(null) ?? false;
                                                           var tracerAssemblyLocation = Type.GetType("SignalFx.Tracing.Tracer, SignalFx.Tracing")?.Assembly.Location;
                                                           var clrProfilerAssemblyLocation = instrumentationType?.Assembly.Location;
                                                           var nl = Environment.NewLine;

                                                           await context.Response.WriteAsync($"Profiler attached: {profilerAttached}{nl}");
                                                           await context.Response.WriteAsync($"SignalFx.Tracing: {tracerAssemblyLocation}{nl}");
                                                           await context.Response.WriteAsync($"Datadog.Trace.ClrProfiler.Managed: {clrProfilerAssemblyLocation}{nl}");

                                                           foreach (var envVar in GetEnvironmentVariables())
                                                           {
                                                               await context.Response.WriteAsync($"{envVar.Key}={envVar.Value}{nl}");
                                                           }

                                                           await context.Response.WriteAsync("Hello World: v2");
                                                       });

                                 endpoints.MapGet("/bad-request", context =>
                                                            {
                                                                throw new Exception("Hello World!");
                                                            });

                                 endpoints.MapGet("/status-code/{statusCode=200}", async context =>
                                                                               {
                                                                                   object statusCode = context.Request.RouteValues["statusCode"];
                                                                                   context.Response.StatusCode = int.Parse((string)statusCode);
                                                                                   await context.Response.WriteAsync($"Status Code: {statusCode}");
                                                                               });
                             });

        }
        private IEnumerable<KeyValuePair<string, string>> GetEnvironmentVariables()
        {
            var prefixes = new[]
                           {
                               "COR_",
                               "CORECLR_",
                               "DD_",
                               "DATADOG_"
                           };

            var envVars = from envVar in Environment.GetEnvironmentVariables().Cast<DictionaryEntry>()
                          from prefix in prefixes
                          let key = (envVar.Key as string)?.ToUpperInvariant()
                          let value = envVar.Value as string
                          where key.StartsWith(prefix)
                          orderby key
                          select new KeyValuePair<string, string>(key, value);

            return envVars;
        }
```


12. Update the version in the return route of hello world e.g. Hello World v1 v2 v3 etc...


13. Build image `docker build -t jekbao/aspdotnetcore3dot1 . --no-cache`

14. Add environment variables to config for sending DIRECTLY to Splunk O11y without going through OTel Collector

```
docker run -it --rm \
-e SIGNALFX_SERVICE_NAME=jek-aspdotnetcore3dot1-auto-instr \
-e SIGNALFX_ENDPOINT_URL=https://ingest.<the realm>.signalfx.com/v2/trace \
-e SIGNALFX_ACCESS_TOKEN=<the token> \
-e SIGNALFX_ENV=jek-playground-env \
-e CORECLR_ENABLE_PROFILING=1 \
-e CORECLR_PROFILER="{B4C89B0F-9908-4F73-9F59-0D77C5A06874}" \
-e CORECLR_PROFILER_PATH=/opt/signalfx-dotnet-tracing/SignalFx.Tracing.ClrProfiler.Native.so \
-e SIGNALFX_INTEGRATIONS=/opt/signalfx-dotnet-tracing/integrations.json \
-e SIGNALFX_DOTNET_TRACER_HOME=/opt/signalfx-dotnet-tracing \
-p 5000:80 --name jek_aspnetcore3dot1 jekbao/aspdotnetcore3dot1
```

15. Test the app at `http://localhost:5000`
