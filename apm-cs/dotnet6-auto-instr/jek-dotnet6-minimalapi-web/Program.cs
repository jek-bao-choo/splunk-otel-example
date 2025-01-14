using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Reflection;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World from .NET 6.0.428");

// New endpoint to list out assemblies that are loaded
app.MapGet("/assemblies", () => {
    var loadedAssemblies = AppDomain.CurrentDomain.GetAssemblies();
    var assemblyNames = loadedAssemblies
        .Select(a => a.GetName().Name)
        .OrderBy(name => name)
        .ToList();

    // Write them to the console
    Console.WriteLine("Loaded assemblies:");
    foreach (var name in assemblyNames)
    {
        Console.WriteLine(name);
    }

    return string.Join("\n", assemblyNames);
});

// Simple endpoint to show how to call "dotnet list package"
app.MapGet("/packages", () =>
{
    // Prepare a process to run "dotnet list package" in the current project directory
    var process = new Process
    {
        StartInfo = new ProcessStartInfo
        {
            FileName = "dotnet",
            Arguments = "list package",
            // We want to capture the output in our C# code
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        }
    };

    // Start the process
    process.Start();

    // Read the output (and error, if any)
    string output = process.StandardOutput.ReadToEnd();
    string error = process.StandardError.ReadToEnd();

    // Wait for the process to finish
    process.WaitForExit();

    // If there's an error message, you might want to handle it differently.
    // For simplicity, we'll just show everything in one go.
    if (!string.IsNullOrEmpty(error))
    {
        return $"Error running 'dotnet list package':\n{error}";
    }

    // Return the captured output
    return output;
});

app.Run();
