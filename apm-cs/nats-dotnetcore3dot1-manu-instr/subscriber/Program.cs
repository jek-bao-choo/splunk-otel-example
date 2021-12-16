using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using System.Diagnostics;
using System.Threading;
using NATS.Client;

using OpenTracing;
using OpenTracing.Util;
using OpenTracing.Propagation;
using OpenTracing.Tag;

namespace subscriber
{

    public class Program
    {

        private static ITracer tracer = GlobalTracer.Instance; // Added for open tracing

        Dictionary<string, string> parsedArgs = new Dictionary<string, string>();

        int count = 1000000;
        string url = Defaults.Url;
        string subject = "jekSubject";
        bool sync = false;
        int received = 0;
        bool verbose = false;
        string creds = null;

        public void Run(string[] args)
        {
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
                TimeSpan elapsed;

                if (sync)
                {
                    elapsed = receiveSyncSubscriber(c);
                }
                else
                {
                    elapsed = receiveAsyncSubscriber(c);
                }

                Console.Write("Received {0} msgs in {1} seconds ", received, elapsed.TotalSeconds);
                Console.WriteLine("({0} msgs/second).",
                    (int)(received / elapsed.TotalSeconds));
                printStats(c);

            }
        }

        private void printStats(IConnection c)
        {
            IStatistics s = c.Stats;
            Console.WriteLine("Statistics:  ");
            Console.WriteLine("   Incoming Payload Bytes: {0}", s.InBytes);
            Console.WriteLine("   Incoming Messages: {0}", s.InMsgs);
        }

        private TimeSpan receiveAsyncSubscriber(IConnection c)
        {
            Stopwatch sw = new Stopwatch();
            Object testLock = new Object();

            EventHandler<MsgHandlerEventArgs> msgHandler = (sender, args) =>
            {
                if (received == 0)
                    sw.Start();

                received++;

                if (verbose)
                {
                    Console.WriteLine("AsyncReceived: " + args.Message);


                    var msg = args.Message;
                    Dictionary<string, string> contextPropagationKeyValuePairs = new Dictionary<string, string>(); // todo: msg to dict
                    foreach (KeyValuePair<string, string> kvp in contextPropagationKeyValuePairs)
                    {
                        Console.WriteLine("**********subscriber testKeyValuePairs v2 ------> ");
                        Console.WriteLine("Key = {0}, Value = {1}", kvp.Key, kvp.Value);
                    }
                    ISpanContext context = tracer.Extract(BuiltinFormats.TextMap, new TextMapExtractAdapter(contextPropagationKeyValuePairs)); // ref https://github.com/opentracing/opentracing-csharp/tree/master/examples/OpenTracing.Examples
                    using (IScope scope = tracer.BuildSpan("MySubscriberSpan")
                        .WithTag(Tags.SpanKind.Key, Tags.SpanKindConsumer)
                        .WithTag(Tags.Component.Key, "nats-example-consumer")
                        .AsChildOf(context)
                        .StartActive(finishSpanOnDispose: true))
                    {
                        var span = scope.Span;
                        span.SetTag("MyTag", "MyValue");
                        span.Log("My Log Statement");
                    }
               
                }

                if (received >= count)
                {
                    sw.Stop();
                    lock (testLock)
                    {
                        Monitor.Pulse(testLock);
                    }
                }
            };

            using (IAsyncSubscription s = c.SubscribeAsync(subject, msgHandler))
            {
                // just wait until we are done.
                lock (testLock)
                {
                    Monitor.Wait(testLock);
                }
            }

            return sw.Elapsed;
        }


        private TimeSpan receiveSyncSubscriber(IConnection c)
        {
            using (ISyncSubscription s = c.SubscribeSync(subject))
            {
                Stopwatch sw = new Stopwatch();

                while (received < count)
                {
                    if (received == 0)
                        sw.Start();

                    Msg m = s.NextMessage();
                    received++;

                    if (verbose)
                        Console.WriteLine("SyncReceived: " + m);
                }

                sw.Stop();

                return sw.Elapsed;
            }
        }

        private void usage()
        {
            Console.Error.WriteLine(
                "Usage:  Subscribe [-url url] [-subject subject] " +
                "[-count count] [-creds file] [-sync] [-verbose]");

            Environment.Exit(-1);
        }

        private void parseArgs(string[] args)
        {
            if (args == null)
                return;

            for (int i = 0; i < args.Length; i++)
            {
                if (args[i].Equals("-sync") ||
                    args[i].Equals("-verbose"))
                {
                    parsedArgs.Add(args[i], "true");
                }
                else
                {
                    if (i + 1 == args.Length)
                        usage();

                    parsedArgs.Add(args[i], args[i + 1]);
                    i++;
                }

            }

            if (parsedArgs.ContainsKey("-count"))
                count = Convert.ToInt32(parsedArgs["-count"]);

            if (parsedArgs.ContainsKey("-url"))
                url = parsedArgs["-url"];

            if (parsedArgs.ContainsKey("-subject"))
                subject = parsedArgs["-subject"];

            if (parsedArgs.ContainsKey("-sync"))
                sync = true;

            if (parsedArgs.ContainsKey("-verbose"))
                verbose = true;

            if (parsedArgs.ContainsKey("-creds"))
                creds = parsedArgs["-creds"];
        }

        private void banner()
        {
            Console.WriteLine("Receiving {0} messages on subject {1}",
                count, subject);
            Console.WriteLine("  Url: {0}", url);
            Console.WriteLine("  Subject: {0}", subject);
            Console.WriteLine("  Receiving: {0}",
                sync ? "Synchronously" : "Asynchronously");
        }

        public static void Main(string[] args)
        {
            try
            {
                new Program().Run(args); // ref https://github.com/nats-io/nats.net/tree/master/src/Samples/Subscribe
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
