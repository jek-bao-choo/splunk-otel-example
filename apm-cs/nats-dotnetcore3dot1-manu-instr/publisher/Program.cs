using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using System.Diagnostics;
using System.Text;
using NATS.Client;

using SignalFx.Tracing;
using OpenTracing;
using OpenTracing.Util;

namespace publisher
{
    // Based mostly on:
    // https://github.com/nats-io/nats.net/tree/master/src/Samples/Subscribe
    public class Program
    {

        private static ITracer tracer = GlobalTracer.Instance;  // Added for open tracing

        Dictionary<string, string> parsedArgs = new Dictionary<string, string>();

        int count = 1;
        string url = Defaults.Url;
        string subject = "jekSubject";
        byte[] payload = null;
        string creds = null;

        public void Run(string[] args)
        {
            Stopwatch sw = null;

            parseArgs(args);
            banner();

            Options opts = ConnectionFactory.GetDefaultOptions();
            opts.Url = url;
            if (creds != null)
            {
                opts.SetUserCredentials(creds);
            }

            using (IConnection c = new ConnectionFactory().CreateConnection(opts))
            {
                sw = Stopwatch.StartNew();

                for (int i = 0; i < count; i++)
                {
                    // todo: Add in inject context propagation try to refer kafka example https://github.com/signalfx/signalfx-dotnet-tracing/tree/main/samples
                    var activeSpan = Tracer.Instance.StartActive("Jek publisher span");
                    Console.WriteLine("**********Tracer.Instance.StartActive = activeSpan", activeSpan);
                    // todo: How to inject context into payload

                    using (IScope scope = tracer.BuildSpan("MyPublisherSpan")
                        //.WithTag(Tags.SpanKind.Key, Tags.SpanKindClient)
                        //.WithTag(Tags.Component.Key, "example-client")
                        .StartActive(finishSpanOnDispose: true))
                    {
                        var span = scope.Span;
                        span.SetTag("MyTag", "MyValue");
                        span.Log("My Log Statement");
                        Console.WriteLine("**********tracer.BuildSpan = span", span);
                        //tracer.Inject(scope.Span.Context, "?", "?"); // Examples https://github.com/opentracing/opentracing-csharp/tree/master/examples/OpenTracing.Examples
                    }
                    // todo: How to inject context into payload


                    c.Publish(subject, payload);
                }
                c.Flush();

                sw.Stop();

                Console.Write("Published {0} msgs in {1} seconds ", count, sw.Elapsed.TotalSeconds);
                Console.WriteLine("({0} msgs/second).",
                    (int)(count / sw.Elapsed.TotalSeconds));
                printStats(c);

            }
        }

        private void printStats(IConnection c)
        {
            IStatistics s = c.Stats;
            Console.WriteLine("Statistics:  ");
            Console.WriteLine("   Outgoing Payload Bytes: {0}", s.OutBytes);
            Console.WriteLine("   Outgoing Messages: {0}", s.OutMsgs);
        }

        private void usage()
        {
            Console.Error.WriteLine(
                "Usage:  Publish [-url url] [-subject subject] " +
                "[-count count] [-creds file] [-payload payload]");

            Environment.Exit(-1);
        }

        private void parseArgs(string[] args)
        {
            if (args == null)
                return;

            for (int i = 0; i < args.Length; i++)
            {
                if (i + 1 == args.Length)
                    usage();

                parsedArgs.Add(args[i], args[i + 1]);
                i++;
            }

            if (parsedArgs.ContainsKey("-count"))
                count = Convert.ToInt32(parsedArgs["-count"]);

            if (parsedArgs.ContainsKey("-url"))
                url = parsedArgs["-url"];

            if (parsedArgs.ContainsKey("-subject"))
                subject = parsedArgs["-subject"];

            if (parsedArgs.ContainsKey("-payload"))
                payload = Encoding.UTF8.GetBytes(parsedArgs["-payload"]);

            if (parsedArgs.ContainsKey("-creds"))
                creds = parsedArgs["-creds"];
        }

        private void banner()
        {
            Console.WriteLine("Publishing {0} messages on subject {1}",
                count, subject);
            Console.WriteLine("  Url: {0}", url);
            Console.WriteLine("  Subject: {0}", subject);
            Console.WriteLine("  Count: {0}", count);
            Console.WriteLine("  Payload is {0} bytes.",
                payload != null ? payload.Length : 0);
        }

        public static void Main(string[] args)
        {
            try
            {
                new Program().Run(args);
                //CreateHostBuilder(args).Build().Run(); // toggle between web and program. Use the web to test if CLR Profiler is loaded
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("Exception: " + ex.Message);
                Console.Error.WriteLine(ex);
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
