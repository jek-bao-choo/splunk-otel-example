# .NET Development Setup Guide

This guide provides comprehensive instructions for setting up a .NET development environment and creating API projects using different approaches.

## Prerequisites

### .NET SDK Installation

1. Download the .NET 6.0.428 SDK from https://dotnet.microsoft.com/en-us/download/dotnet/6.0

In the folder with global.json run `dotnet --version` to check that the version is 6.0.428.

 Minimal APIs

Minimal APIs provide a streamlined approach ideal for microservices and small applications. They offer a simplified architecture with reduced boilerplate code.

**Documentation:**
https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-6.0&tabs=visual-studio-code

1. `dotnet new web -o jek-dotnet6-minimalapi-web`

2. Navigate to the project directory:
   ```
   cd jek-dotnet6-minimalapi-web
   ```

3. Configure HTTPS certificate:
   ```
   dotnet dev-certs https --trust
   ```

4. Add NuGets
```
dotnet add package Microsoft.EntityFrameworkCore.InMemory --version 6.0.28
dotnet add package Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore --version 6.0.28
```

5. Run the application:
   ```
   dotnet run
   ```

6. Another terminal to test it:
```
curl http://localhost:<the port number>
```