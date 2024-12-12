# Install
## SDK
- Download .NET SDK from https://dotnet.microsoft.com/
    - At the time of writing I downloaded .NET 8 https://dotnet.microsoft.com/en-us/download/dotnet/8.0
    - You could also download .NET 6 from https://dotnet.microsoft.com/en-us/download/dotnet/6.0
- Install the .NET SDK (version 8)
- In terminal run `dotnet --version` to check the version.
- The dotnet commands are here https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet

## Visual Studio Code
- Open Visual Studio Code (VSC) on Mac
- In VSC install C#

# New & Run
- The dotnet new commands are here https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-new
- For APIs, there seemed to be two types that are relevant to my validation.
    - Minimal APIs https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-8.0&tabs=visual-studio-code
        - Something more for learning is that ASP.NET Core API `webapiaot` for .NET 8 because it is introduced in .NET 8 and above. Where AOT stands for Ahead-of-time compilation. The ASP.NET Core Web API (Native AOT) template (short name webapiaot) creates a project with AOT enabled. The template differs from the Web API project template in the following ways: ... Uses minimal APIs only, as MVC isn't yet compatible with Native AOT...
    - Controlled-based APIs https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-8.0&tabs=visual-studio 
        - This uses the `webapi` template. 
- `--output <OUTPUT_DIRECTORY>`
-`--verbosity <LEVEL>` introduced after .NET 7

## Option 1: Minimal APIs
- Follow through this tutorial https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-8.0&tabs=visual-studio 
- `dotnet new web --output jek-dotnet8-minimalapi-web --verbosity diag --dry-run`
    - The `web` template is introduced in .NET (version 1). The `web` template creates an ASP.NET Core Empty project.
- `cd jek-dotnet8-minimalapi`
- `dotnet dev-certs https --trust`
- `dotnet run`
- Just follow through the tutorial link

## Option 2: Controller-based APIs
- Follow through this tutorial https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-8.0&tabs=visual-studio
- `dotnet new webapi --use-controllers --output jek-dotnet8-controllerbasedapi-webapi --verbosity diag --dry-run`
    - The `webapi` template is introduced in .NET (version 1). The `webapi` template creates an ASP.NET Core Web API.
- `cd jek-dotnet8-controllerbasedapi-webapi`
- `dotnet add package Microsoft.EntityFrameworkCore.InMemory`
- `code -r ../jek-dotnet8-controllerbasedapi-webapi`
- `dotnet dev-certs https --trust`
- `dotnet run --launch-profile https`
- Just follow through the tutorial link

# Build
- `dotnet build`

# Publish
- `dotnet publish`
... `dotnet restore`

# Optional
## NuGet Gallery *optional
- In NuGet Gallery extension by pcislo  
- Press `command + shift + p`
- Search for NuGet