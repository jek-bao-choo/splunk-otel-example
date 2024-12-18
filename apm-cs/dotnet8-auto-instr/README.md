# .NET Development Setup Guide

## Prerequisites

### .NET SDK Installation
1. Download the .NET SDK from https://dotnet.microsoft.com/
   - For .NET 8 (recommended): https://dotnet.microsoft.com/en-us/download/dotnet/8.0
   - For .NET 6 (alternative): https://dotnet.microsoft.com/en-us/download/dotnet/6.0

2. After installation, verify your setup:
   ```
   dotnet --version
   ```

3. For a complete list of dotnet commands, visit: https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet

### Development Environment Setup
1. Install Visual Studio Code (VSCode)
2. Install the C# extension in VSCode

## Creating a New API Project

For detailed information about `dotnet new` commands, visit: https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-new

There are two main approaches for building APIs in .NET:

### 1. Minimal APIs
Minimal APIs are ideal for microservices and small applications. They offer a simplified, lightweight approach to building APIs.

- Documentation: https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-8.0&tabs=visual-studio-code
- Note: The `webapiaot` template (for .NET 8+) includes Ahead-of-time compilation support and is limited to minimal APIs only.

#### Setup Steps:
1. Create a new project:
   ```
   dotnet new web --output jek-dotnet8-minimalapi-web --verbosity diag --dry-run
   ```
   Note: The `web` template creates an empty ASP.NET Core project.


Note: Command line parameters:
- `--output <OUTPUT_DIRECTORY>`: Specifies the output directory
- `--verbosity <LEVEL>`: Sets logging detail (available in .NET 7+)

2. Navigate to project directory:
   ```
   cd jek-dotnet8-minimalapi-web
   ```

3. Configure HTTPS certificate:
   ```
   dotnet dev-certs https --trust
   ```

4. Run the application:
   ```
   dotnet run
   ```

### 2. Controller-based APIs
Controller-based APIs provide a more traditional, feature-rich approach suitable for larger applications.

- Documentation: https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-8.0&tabs=visual-studio

#### Setup Steps:
1. Create a new project:
   ```
   dotnet new webapi --use-controllers --output jek-dotnet8-controllerbasedapi-webapi --verbosity diag --dry-run
   ```
   Note: The `webapi` template creates a standard ASP.NET Core Web API.

2. Navigate to project directory:
   ```
   cd jek-dotnet8-controllerbasedapi-webapi
   ```

3. Add Entity Framework Core In-Memory package:
   ```
   dotnet add package Microsoft.EntityFrameworkCore.InMemory
   ```

4. Open in VSCode:
   ```
   code -r ../jek-dotnet8-controllerbasedapi-webapi
   ```

5. Configure HTTPS certificate:
   ```
   dotnet dev-certs https --trust
   ```

6. Run the application:
   ```
   dotnet run --launch-profile https
   ```

## Common Commands

### Building the Application
```
dotnet build
```

### Publishing the Application 
- Turn on Docker or ensure that Docker is running
- Following this instruction it is built into it with https://learn.microsoft.com/en-us/dotnet/core/docker/introduction#building-container-images
```
dotnet publish --framework net8.0 -t:PublishContainer --os linux --arch x64 /p:ContainerImageName=jchoo/jek-dotnet8-minimalapi-web /p:ContainerImageTag=1.0

docker run --rm -d -p 8000:8080 jek-dotnet8-minimalapi-web
```

Test it 

```
curl -s http://localhost:8000
```

End it
```
docker ps

docker kill <container id>
```

### Push to Docker Hub
```
docker push jchoo/jek-dotnet8-minimalapi-web:1.0
```

## Optional Tools

### NuGet Package Management
1. Install the NuGet Gallery extension by pcislo in VSCode
2. Access NuGet commands:
   - Press `Command + Shift + P`
   - Search for "NuGet"
