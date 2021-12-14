This is WIP.
Next step containerised with Docker so that can add CLR profiler and run it with Profiler.
After adding profiler is to print with trace id and span id to ensure it has local context.

Terminal 1 in subscriber folder

$ `cd subscriber`

$ `dotnet run -verbose`


Terminal 2 in publisher folder run

$ `cd publisher`

$ `dotnet run -payload helloworldv1`
